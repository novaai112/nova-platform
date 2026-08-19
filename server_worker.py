import os
import sys
import signal
import atexit
import time
import json
import shutil
import subprocess
import threading
from supabase import create_client, Client
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
import pickle

SUPABASE_URL = "https://opzfhsonosqqxometiou.supabase.co"
SUPABASE_KEY = "sb_publishable_tZ-Wulo5bNADs-w9dca3Vw_3CL1RNuo"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
GDRIVE_CREDENTIALS_FILE = "gdrive_credentials.json"
GDRIVE_FOLDER_ID = "1KZHUZRKiGo4-vGscoLWJIw86BlagxWqS" 

ANSYS_EXE = r"C:\Program Files\ANSYS Inc\v241\Framework\bin\Win64\RunWB2.exe"
ANSYS_LAUNCHER_SCRIPT = os.path.abspath("Launcher.py")

def authenticate_gdrive():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(GDRIVE_CREDENTIALS_FILE, ['https://www.googleapis.com/auth/drive.file'])
        creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    return build('drive', 'v3', credentials=creds)

def upload_to_gdrive(file_path, file_name):
    print(f"Uploading {file_name} to Google Drive...")
    service = authenticate_gdrive()
    file_metadata = {
        'name': file_name,
        'parents': [GDRIVE_FOLDER_ID]
    }
    mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' if file_name.lower().endswith('.docx') else 'application/zip'
    media = MediaFileUpload(file_path, mimetype=mimetype, resumable=True)
    
    file = service.files().create(
        body=file_metadata, 
        media_body=media, 
        fields='id, webViewLink, webContentLink'
    ).execute()
    
    service.permissions().create(
        fileId=file.get('id'),
        body={'type': 'anyone', 'role': 'reader'}
    ).execute()
    
    link = file.get('webContentLink') or file.get('webViewLink')
    print(f"Uploaded successfully! Link: {link}")
    return link

def zip_analysis_folder(folder_path, output_filename, retries=10):
    for i in range(retries):
        try:
            print(f"Attempting to zip (Attempt {i+1}/{retries})...")
            shutil.make_archive(output_filename.replace('.zip', ''), 'zip', folder_path)
            print("Successfully zipped!")
            return output_filename
        except PermissionError:
            print("File is still locked by Ansys. Waiting 3 seconds...")
            time.sleep(3)
        except Exception as e:
            if i == retries - 1: raise e
            time.sleep(3)
    raise Exception("Could not zip files after multiple retries due to file locks.")

def update_job_status(job_id, status_msg):
    if not job_id or not status_msg:
        return
    try:
        supabase.table("ansys_jobs").update({"status": str(status_msg)}).eq("id", job_id).execute()
        print(f"[{job_id[:8]}] Status -> {status_msg}")
    except Exception as e:
        print(f"Failed to update status ({status_msg}): {e}")

def mark_job_failed(job_id, error_msg):
    if not job_id:
        return
    try:
        supabase.table("ansys_jobs").update({
            "status": "Failed",
            "error_message": str(error_msg)
        }).eq("id", job_id).execute()
        print(f"[{job_id[:8]}] Status -> Failed | Reason: {error_msg}")
    except Exception as e:
        print(f"Failed to record failure for job {job_id}: {e}")

def recover_orphaned_jobs():
    try:
        res = supabase.table("ansys_jobs").select("id, status").not_.in_("status", ["Completed", "Failed", "Pending"]).execute()
        if res.data:
            print(f"[RECOVERY] Checking for interrupted / orphaned jobs ({len(res.data)} found)...")
            for j in res.data:
                jid = j["id"]
                st = j.get("status", "Running")
                print(f"[RECOVERY] Marking interrupted job {jid[:8]} (was at '{st}') as Failed.")
                mark_job_failed(jid, f"Simulation was stopped or interrupted in the middle of execution (was at: {st}).")
    except Exception as e:
        print(f"Warning during orphaned job recovery: {e}")

current_active_job = None

def handle_interrupt(sig, frame):
    global current_active_job
    print("\n[BROKER] Interrupt/Cancellation signal received! Terminating active solver...")
    if current_active_job:
        print(f"[BROKER] Marking active job {current_active_job[:8]} as Failed in database...")
        mark_job_failed(current_active_job, "Analysis was stopped or cancelled by user during execution.")
        cleanup_workspace(current_active_job)
    sys.exit(0)

try:
    signal.signal(signal.SIGINT, handle_interrupt)
    signal.signal(signal.SIGTERM, handle_interrupt)
except Exception:
    pass

def monitor_status(job_id, unique_run_dir, stop_event):
    last_status = None
    while not stop_event.is_set():
        try:
            status_files = []
            if unique_run_dir and os.path.exists(unique_run_dir):
                for root, dirs, files in os.walk(unique_run_dir):
                    if "job_status.json" in files:
                        status_files.append(os.path.join(root, "job_status.json"))
            if os.path.exists("job_status.json"):
                status_files.append("job_status.json")
            
            for sf in status_files:
                try:
                    with open(sf, "r") as f:
                        sdata = json.load(f)
                        st = sdata.get("status")
                        if st and st != last_status:
                            last_status = st
                            update_job_status(job_id, st)
                            break
                except Exception:
                    pass
        except Exception:
            pass
        time.sleep(1)

def extract_clean_error(job_id, unique_run_dir, ansys_log_path, returncode=0, raw_stderr=""):
    # 1. Check SpaceClaim errors
    sc_errors = []
    if unique_run_dir and os.path.exists(unique_run_dir):
        for root, dirs, files in os.walk(unique_run_dir):
            for fname in files:
                if fname.startswith("sc_error_") and fname.endswith(".txt"):
                    try:
                        with open(os.path.join(root, fname), "r") as f:
                            sc_errors.append(f.read().strip())
                    except Exception:
                        pass
    if sc_errors:
        raw_msg = "\n".join(sc_errors)
        lines = [l.strip() for l in raw_msg.splitlines() if l.strip() and not l.strip().startswith("File ")]
        clean_detail = lines[-1] if lines else raw_msg[:200]
        return f"Geometry Generation Failed: {clean_detail}"

    # 2. Check Mechanical errors
    mech_errors = []
    if unique_run_dir and os.path.exists(unique_run_dir):
        for root, dirs, files in os.walk(unique_run_dir):
            for fname in files:
                if fname.startswith("mech_error_") and fname.endswith(".txt"):
                    try:
                        with open(os.path.join(root, fname), "r") as f:
                            mech_errors.append(f.read().strip())
                    except Exception:
                        pass
    if mech_errors:
        raw_msg = "\n".join(mech_errors)
        lines = [l.strip() for l in raw_msg.splitlines() if l.strip() and not l.strip().startswith("File ")]
        clean_detail = lines[-1] if lines else raw_msg[:200]
        if "Mesh" in raw_msg or "mesh" in raw_msg.lower():
            return f"Meshing Failed: {clean_detail}"
        if "Solve" in raw_msg or "convergence" in raw_msg.lower():
            return f"Solver Convergence Failed: {clean_detail}"
        if "Word" in raw_msg or "doc" in raw_msg.lower():
            return f"Report Generation Failed: {clean_detail}"
        return f"Simulation Failed: {clean_detail}"

    # 3. Check Ansys Log file
    if ansys_log_path and os.path.exists(ansys_log_path):
        try:
            with open(ansys_log_path, "r") as f:
                log_content = f.read()
                if "License" in log_content or "license" in log_content.lower() or "No license is available" in log_content:
                    return "Ansys License Error: Unable to acquire required solver license."
                if "Insufficient memory" in log_content or "Out of memory" in log_content:
                    return "Solver Out of Memory: Geometry or mesh size exceeded available RAM."
        except Exception:
            pass

    # 4. Handle Windows Exit codes cleanly without dumping raw exit codes or local paths
    if returncode == 3221225786 or returncode == -1073741819 or (raw_stderr and "3221225786" in raw_stderr):
        return "Simulation Solver Error (Memory Access Violation): Solver kernel terminated unexpectedly. Please check nozzle offset, wall thickness, and mesh sizing parameters."
    
    if returncode != 0:
        return f"Simulation Solver Terminated (Exit Code {returncode}). Please verify geometry dimensions and load inputs."

    return "Simulation analysis encountered an unexpected error during execution."

def cleanup_workspace(job_id=None, unique_run_dir=None, zip_path=None, temp_json_path=None, ansys_log_path=None):
    try:
        for proc in ["RunWB2.exe", "AnsysFW.exe", "SpaceClaim.exe", "DS.exe", "Ans.Mechanical.exe"]:
            subprocess.run(["taskkill", "/F", "/IM", proc, "/T"], capture_output=True)
    except Exception:
        pass

    try:
        if unique_run_dir and os.path.exists(unique_run_dir):
            shutil.rmtree(unique_run_dir, ignore_errors=True)
    except Exception:
        pass

    try:
        if zip_path and os.path.exists(zip_path):
            os.remove(zip_path)
    except Exception:
        pass

    try:
        if temp_json_path and os.path.exists(temp_json_path):
            os.remove(temp_json_path)
    except Exception:
        pass

    try:
        if os.path.exists("job_status.json"):
            os.remove("job_status.json")
    except Exception:
        pass

    try:
        for fname in os.listdir(os.getcwd()):
            if (fname.startswith("shell_nozzle_") and fname.endswith(".scdoc")) or (job_id and fname.startswith(f"Run_{job_id}")):
                fpath = os.path.join(os.getcwd(), fname)
                try:
                    if os.path.isfile(fpath):
                        os.remove(fpath)
                    elif os.path.isdir(fpath):
                        shutil.rmtree(fpath, ignore_errors=True)
                except Exception:
                    pass
    except Exception:
        pass

    try:
        if ansys_log_path and os.path.exists(ansys_log_path):
            os.remove(ansys_log_path)
    except Exception:
        pass

def process_jobs():
    global current_active_job
    job_id = None
    unique_run_dir = None
    zip_path = None
    temp_json_path = None
    ansys_log_path = None
    stop_monitor = None
    monitor_thread = None
    try:
        subprocess.run(['taskkill', '/F', '/IM', 'RunWB2.exe', '/T'], capture_output=True)
        
        response = supabase.table("ansys_jobs").select("*").eq("status", "Pending").order("created_at", desc=False).limit(1).execute()
        
        if not response.data:
            return 
        
        job = response.data[0]
        job_id = job['id']
        current_active_job = job_id
        print(f"\n--- New Job Received: {job_id} ---")
        
        update_job_status(job_id, "Preparing Simulation")
        
        payload_data = job['json_payload']
        if isinstance(payload_data, str):
            payload_data = json.loads(payload_data)
            
        unique_run_dir = os.path.join(os.getcwd(), f"Run_{job_id}")
        os.makedirs(unique_run_dir, exist_ok=True)
        
        for item in payload_data:
            orig_folder = item.get('AnalysisFolder', 'Analysis')
            base_name = os.path.basename(orig_folder.replace('\\', '/'))
            if not base_name: 
                base_name = "Analysis_Data"
            item['AnalysisFolder'] = os.path.join(unique_run_dir, base_name)
            
        temp_json_path = os.path.join(os.getcwd(), "Nozzle_Batch_Data.json")
        with open(temp_json_path, 'w') as f:
            json.dump(payload_data, f, indent=4)
            
        print("Executing Ansys Launcher in Background (Batch Mode)...")
        ansys_appdata = os.path.join(os.environ.get('APPDATA', ''), 'Ansys', 'v241')
        if os.path.exists(ansys_appdata):
            for item in os.listdir(ansys_appdata):
                if item.startswith('UserRegFiles'):
                    shutil.rmtree(os.path.join(ansys_appdata, item), ignore_errors=True)
                    
        ansys_log_path = os.path.join(os.getcwd(), f"{job_id}_ansys.log")

        # Start background status synchronizer thread
        stop_monitor = threading.Event()
        monitor_thread = threading.Thread(target=monitor_status, args=(job_id, unique_run_dir, stop_monitor), daemon=True)
        monitor_thread.start()

        result = subprocess.run(
            [ANSYS_EXE, "-B", "-R", ANSYS_LAUNCHER_SCRIPT],
            capture_output=True, text=True
        )

        # Stop background status thread
        if stop_monitor:
            stop_monitor.set()
            monitor_thread.join(timeout=2)

        with open(ansys_log_path, "w") as lf:
            lf.write("=== STDOUT ===\n")
            lf.write(result.stdout or "(empty)")
            lf.write("\n=== STDERR ===\n")
            lf.write(result.stderr or "(empty)")
            
        print(f"Ansys exited with code {result.returncode}. Log: {ansys_log_path}")
        if result.returncode != 0:
            clean_err = extract_clean_error(job_id, unique_run_dir, ansys_log_path, result.returncode, result.stderr)
            raise RuntimeError(clean_err)

        error_files = []
        for root, dirs, files in os.walk(unique_run_dir):
            for fname in files:
                if (fname.startswith("mech_error_") or fname.startswith("sc_error_")) and fname.endswith(".txt"):
                    error_files.append(os.path.join(root, fname))

        if error_files:
            clean_err = extract_clean_error(job_id, unique_run_dir, ansys_log_path, result.returncode, result.stderr)
            raise RuntimeError(clean_err)

        print("Analysis simulation finished. Uploading deliverables to Google Drive...")
        time.sleep(2)

        # 1. Search for and upload generated Word docx FEA report before zipping
        report_url = None
        for root, dirs, files in os.walk(unique_run_dir):
            for fname in files:
                if fname.lower().endswith(".docx"):
                    docx_path = os.path.join(root, fname)
                    try:
                        update_job_status(job_id, "Uploading Report to Drive")
                        report_url = upload_to_gdrive(docx_path, f"{job_id}_{fname}")
                        print(f"Report uploaded successfully! Link: {report_url}")
                        break
                    except Exception as re_err:
                        print(f"Warning: Could not upload docx report: {re_err}")
            if report_url:
                break

        # 2. Zip analysis folder and upload full analysis ZIP
        update_job_status(job_id, "Zipping Analysis Files")
        zip_path = os.path.join(os.getcwd(), f"{job_id}_Full_Analysis.zip")
        zip_analysis_folder(unique_run_dir, zip_path)

        update_job_status(job_id, "Uploading Zip File to Drive")
        file_name = f"{job_id}_Full_Analysis.zip"
        public_url = upload_to_gdrive(zip_path, file_name)

        # 3. Update Supabase with status, result_url, and report_url
        update_data = {
            "status": "Completed",
            "result_url": public_url
        }
        if report_url:
            update_data["report_url"] = report_url

        supabase.table("ansys_jobs").update(update_data).eq("id", job_id).execute()
        print(f"[{job_id[:8]}] Status -> Completed")

        # 4. Clean up all temporary files (zip, json, scdoc, log, run folder) and terminate Ansys
        cleanup_workspace(job_id, unique_run_dir, zip_path, temp_json_path, ansys_log_path)
        current_active_job = None
        print(f"Job {job_id} Completed Successfully. All temporary files cleanly removed.")
        
    except (Exception, KeyboardInterrupt, SystemExit, BaseException) as e:
        if stop_monitor:
            stop_monitor.set()
        
        is_user_interrupt = isinstance(e, (KeyboardInterrupt, SystemExit))
        err_str = "Simulation was stopped / cancelled by user in middle of run." if is_user_interrupt else str(e)
        
        print(f"Job Failed: {err_str}")
        if job_id is not None:
            mark_job_failed(job_id, err_str)
            
        cleanup_workspace(job_id, unique_run_dir, zip_path, temp_json_path, ansys_log_path)
        current_active_job = None
        
        if is_user_interrupt:
            raise e

if __name__ == "__main__":
    print("Ansys Cloud Broker is starting...")
    recover_orphaned_jobs()
    print("Ansys Cloud Broker is running. Waiting for client requests...")
    while True:
        try:
            process_jobs()
        except KeyboardInterrupt:
            print("\n[BROKER] Stopping worker gracefully...")
            break
        except Exception as loop_e:
            print(f"[BROKER] Loop warning: {loop_e}")
        time.sleep(5)