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

def safe_supabase_call(fn, max_retries=5, delay=2):
    for i in range(max_retries):
        try:
            return fn()
        except Exception as e:
            err_str = str(e)
            if "10060" in err_str or "connection" in err_str.lower() or "timeout" in err_str.lower():
                print("[NETWORK] Temporary connection glitch ({0}). Retrying ({1}/{2})...".format(err_str, i+1, max_retries))
                time.sleep(delay * (i + 1))
            else:
                if i == max_retries - 1:
                    print("[SUPABASE] Call failed after retries: {0}".format(err_str))
                    return None
                time.sleep(delay)
    return None

def authenticate_gdrive():
    creds = None
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(GDRIVE_CREDENTIALS_FILE, ["https://www.googleapis.com/auth/drive.file"])
        creds = flow.run_local_server(port=0)
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)
    return build("drive", "v3", credentials=creds)

def upload_to_gdrive(file_path, file_name, max_retries=5):
    print("Uploading {0} to Google Drive...".format(file_name))
    for attempt in range(max_retries):
        try:
            service = authenticate_gdrive()
            file_metadata = {
                "name": file_name,
                "parents": [GDRIVE_FOLDER_ID]
            }
            if file_name.lower().endswith(".docx"):
                mimetype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            elif file_name.lower().endswith(".json"):
                mimetype = "application/json"
            else:
                mimetype = "application/zip"

            media = MediaFileUpload(file_path, mimetype=mimetype, resumable=True)
            
            file = service.files().create(
                body=file_metadata, 
                media_body=media, 
                fields="id, webViewLink, webContentLink"
            ).execute()
            
            service.permissions().create(
                fileId=file.get("id"),
                body={"type": "anyone", "role": "reader"}
            ).execute()
            
            link = file.get("webContentLink") or file.get("webViewLink")
            print("Uploaded successfully! Link: {0}".format(link))
            return link
        except Exception as e:
            err_str = str(e)
            print("[GDRIVE] Upload error on attempt {0}/{1}: {2}".format(attempt + 1, max_retries, err_str))
            if attempt == max_retries - 1:
                raise e
            time.sleep(3 * (attempt + 1))
    return None

def zip_analysis_folder(folder_path, output_filename, retries=10):
    for i in range(retries):
        try:
            print("Attempting to zip (Attempt {0}/{1})...".format(i+1, retries))
            shutil.make_archive(output_filename.replace(".zip", ""), "zip", folder_path)
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
    safe_supabase_call(lambda: supabase.table("ansys_jobs").update({"status": str(status_msg)}).eq("id", job_id).execute())
    print("[{0}] Status -> {1}".format(job_id[:8], status_msg))

def mark_job_failed(job_id, error_msg):
    if not job_id:
        return
    safe_supabase_call(lambda: supabase.table("ansys_jobs").update({
        "status": "Failed",
        "error_message": str(error_msg)
    }).eq("id", job_id).execute())
    print("[{0}] Status -> Failed | Reason: {1}".format(job_id[:8], error_msg))

def recover_orphaned_jobs():
    try:
        res = safe_supabase_call(lambda: supabase.table("ansys_jobs").select("id, status").not_.in_("status", ["Completed", "Failed", "Pending"]).execute())
        if res and res.data:
            print("[RECOVERY] Checking for interrupted / orphaned jobs ({0} found)...".format(len(res.data)))
            for j in res.data:
                jid = j["id"]
                st = j.get("status", "Running")
                print("[RECOVERY] Marking interrupted job {0} (was at '{1}') as Failed.".format(jid[:8], st))
                mark_job_failed(jid, "Simulation was stopped or interrupted in the middle of execution (was at: {0}).".format(st))
    except Exception as e:
        print("Warning during orphaned job recovery: {0}".format(e))

current_active_job = None

def handle_interrupt(sig, frame):
    global current_active_job
    print("\n[BROKER] Interrupt/Cancellation signal received! Terminating active solver...")
    if current_active_job:
        print("[BROKER] Marking active job {0} as Failed in database...".format(current_active_job[:8]))
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
            candidates = []
            if unique_run_dir and os.path.exists(unique_run_dir):
                for root, dirs, files in os.walk(unique_run_dir):
                    if "job_status.json" in files:
                        candidates.append(os.path.join(root, "job_status.json"))
            if os.path.exists("job_status.json"):
                candidates.append("job_status.json")

            best_status = None
            best_time = 0

            for sf in candidates:
                try:
                    mtime = os.path.getmtime(sf)
                    with open(sf, "r") as f:
                        sdata = json.load(f)
                        st = sdata.get("status")
                        ts = sdata.get("timestamp", mtime)
                        if st and ts > best_time:
                            best_time = ts
                            best_status = st
                except Exception:
                    pass

            if best_status and best_status != last_status:
                last_status = best_status
                update_job_status(job_id, best_status)
        except Exception:
            pass
        time.sleep(1)

def extract_clean_error(job_id, unique_run_dir, ansys_log_path, returncode=0, raw_stderr=""):
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
        return "Geometry Generation Failed: {0}".format(clean_detail)

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
            return "Meshing Failed: {0}".format(clean_detail)
        if "Solve" in raw_msg or "convergence" in raw_msg.lower():
            return "Solver Convergence Failed: {0}".format(clean_detail)
        if "Word" in raw_msg or "doc" in raw_msg.lower():
            return "Report Generation Failed: {0}".format(clean_detail)
        return "Simulation Failed: {0}".format(clean_detail)

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

    if returncode == 3221225786 or returncode == -1073741819 or (raw_stderr and "3221225786" in raw_stderr):
        return "Simulation Solver Error (Memory Access Violation): Solver kernel terminated unexpectedly. Please check nozzle offset, wall thickness, and mesh sizing parameters."
    
    if returncode != 0:
        return "Simulation Solver Terminated (Exit Code {0}). Please verify geometry dimensions and load inputs.".format(returncode)

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
            if (fname.startswith("shell_nozzle_") and fname.endswith(".scdoc")) or (job_id and fname.startswith("Run_{0}".format(job_id))):
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
        subprocess.run(["taskkill", "/F", "/IM", "RunWB2.exe", "/T"], capture_output=True)
        
        response = safe_supabase_call(lambda: supabase.table("ansys_jobs").select("*").eq("status", "Pending").order("created_at", desc=False).limit(1).execute())
        
        if not response or not response.data:
            return 
        
        job = response.data[0]
        job_id = job["id"]
        current_active_job = job_id
        print("\n--- New Job Received: {0} ---".format(job_id))
        
        update_job_status(job_id, "Preparing Simulation")
        
        payload_data = job["json_payload"]
        if isinstance(payload_data, str):
            payload_data = json.loads(payload_data)
            
        unique_run_dir = os.path.join(os.getcwd(), "Run_{0}".format(job_id))
        os.makedirs(unique_run_dir, exist_ok=True)
        
        for item in payload_data:
            orig_folder = item.get("AnalysisFolder", "Analysis")
            base_name = os.path.basename(orig_folder.replace("\\", "/"))
            if not base_name: 
                base_name = "Analysis_Data"
            item["AnalysisFolder"] = os.path.join(unique_run_dir, base_name)
            
        temp_json_path = os.path.join(os.getcwd(), "Nozzle_Batch_Data.json")
        with open(temp_json_path, "w") as f:
            json.dump(payload_data, f, indent=4)
            
        print("Executing Ansys Launcher in Background (Batch Mode)...")
        ansys_appdata = os.path.join(os.environ.get("APPDATA", ""), "Ansys", "v241")
        if os.path.exists(ansys_appdata):
            for item in os.listdir(ansys_appdata):
                if item.startswith("UserRegFiles"):
                    shutil.rmtree(os.path.join(ansys_appdata, item), ignore_errors=True)
                    
        ansys_log_path = os.path.join(os.getcwd(), "{0}_ansys.log".format(job_id))

        stop_monitor = threading.Event()
        monitor_thread = threading.Thread(target=monitor_status, args=(job_id, unique_run_dir, stop_monitor), daemon=True)
        monitor_thread.start()

        result = subprocess.run(
            [ANSYS_EXE, "-B", "-R", ANSYS_LAUNCHER_SCRIPT],
            capture_output=True, text=True
        )

        if stop_monitor:
            stop_monitor.set()
            monitor_thread.join(timeout=2)

        with open(ansys_log_path, "w") as lf:
            lf.write("=== STDOUT ===\n")
            lf.write(result.stdout or "(empty)")
            lf.write("\n=== STDERR ===\n")
            lf.write(result.stderr or "(empty)")
            
        print("Ansys exited with code {0}. Log: {1}".format(result.returncode, ansys_log_path))
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

        # 1. Upload Word FEA Report
        report_url = None
        for root, dirs, files in os.walk(unique_run_dir):
            for fname in files:
                if fname.lower().endswith(".docx"):
                    docx_path = os.path.join(root, fname)
                    try:
                        update_job_status(job_id, "Uploading Report to Drive")
                        report_url = upload_to_gdrive(docx_path, "{0}_{1}".format(job_id, fname))
                        print("Report uploaded successfully! Link: {0}".format(report_url))
                        safe_supabase_call(lambda: supabase.table("ansys_jobs").update({"report_url": report_url, "status": "Uploading Results"}).eq("id", job_id).execute())
                        break
                    except Exception as re_err:
                        print("Warning: Could not upload docx report: {0}".format(re_err))
            if report_url:
                break

        # 2. Upload JSON Results
        json_url = None
        for root, dirs, files in os.walk(unique_run_dir):
            for fname in files:
                if fname.lower().endswith("_mechanical_results.json"):
                    res_json_path = os.path.join(root, fname)
                    try:
                        json_url = upload_to_gdrive(res_json_path, "{0}_{1}".format(job_id, fname))
                        print("JSON results uploaded successfully! Link: {0}".format(json_url))
                        safe_supabase_call(lambda: supabase.table("ansys_jobs").update({"json_url": json_url}).eq("id", job_id).execute())
                        break
                    except Exception as je_err:
                        print("Warning: Could not upload json results: {0}".format(je_err))
            if json_url:
                break

        # 3. Zip analysis folder and upload full analysis ZIP
        update_job_status(job_id, "Zipping Analysis Files")
        zip_path = os.path.join(os.getcwd(), "{0}_Full_Analysis.zip".format(job_id))
        zip_analysis_folder(unique_run_dir, zip_path)

        update_job_status(job_id, "Uploading Zip File to Drive")
        file_name = "{0}_Full_Analysis.zip".format(job_id)
        public_url = upload_to_gdrive(zip_path, file_name)

        # 4. Final DB update with Completed status and all download URLs
        update_data = {
            "status": "Completed",
            "result_url": public_url
        }
        if report_url:
            update_data["report_url"] = report_url
        if json_url:
            update_data["json_url"] = json_url

        safe_supabase_call(lambda: supabase.table("ansys_jobs").update(update_data).eq("id", job_id).execute())
        print("[{0}] Status -> Completed".format(job_id[:8]))

        # 5. Clean up all temporary files
        cleanup_workspace(job_id, unique_run_dir, zip_path, temp_json_path, ansys_log_path)
        current_active_job = None
        print("Job {0} Completed Successfully. All temporary files cleanly removed.".format(job_id))
        
    except (Exception, KeyboardInterrupt, SystemExit, BaseException) as e:
        if stop_monitor:
            stop_monitor.set()
        
        is_user_interrupt = isinstance(e, (KeyboardInterrupt, SystemExit))
        err_str = "Simulation was stopped / cancelled by user in middle of run." if is_user_interrupt else str(e)
        
        print("Job Failed: {0}".format(err_str))
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
            print("[BROKER] Loop warning: {0}".format(loop_e))
        time.sleep(5)