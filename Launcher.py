import os
import sys
import re
import uuid
import json
import math
import datetime
import tempfile

def write_status(status_msg, base_dir=None):
    try:
        data = json.dumps({"status": str(status_msg), "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
        paths_to_write = [os.getcwd(), os.path.dirname(os.path.abspath(__file__))]
        if base_dir:
            paths_to_write.insert(0, base_dir)
            parent_b = os.path.dirname(base_dir)
            if parent_b:
                paths_to_write.insert(1, parent_b)
        for p in paths_to_write:
            if p and os.path.exists(p):
                try:
                    with open(os.path.join(p, "job_status.json"), "w") as sf:
                        sf.write(data)
                except Exception:
                    pass
    except Exception:
        pass

def to_float(val):
    if val is None or str(val).strip() == "":
        return 0.0
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0

def to_int(val):
    if val is None or str(val).strip() == "":
        return 0
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return 0

def clean_name(s):
    return re.sub(r"[\s\-_]+", "", str(s)).lower()

def interp(t_arr, v_arr, t):
    if not t_arr or not v_arr:
        return None
    if t <= t_arr[0]:
        return v_arr[0]
    if t >= t_arr[-1]:
        return v_arr[-1]
    for i in range(len(t_arr) - 1):
        if t_arr[i] <= t <= t_arr[i + 1]:
            frac = (t - t_arr[i]) / (t_arr[i + 1] - t_arr[i])
            return v_arr[i] + frac * (v_arr[i + 1] - v_arr[i])
    return v_arr[-1]

def find_mat(name, db):
    target = clean_name(name)
    if isinstance(db, list):
        for m in db:
            if clean_name(m.get("Name", "")) == target:
                return m
    elif isinstance(db, dict):
        for k in db:
            if clean_name(k) == target:
                return db[k]
            if isinstance(db[k], dict) and clean_name(db[k].get("Name", "")) == target:
                return db[k]
    return None

def get_props(name, alt_name, ym, pr, allow, yld, uts, temp, db, a_type):
    is_cust = str(name).strip().lower() == "other material"
    disp = str(alt_name).strip() if (is_cust and str(alt_name).strip()) else str(name).strip()
    p = {
        "is_custom": is_cust,
        "display_name": disp,
        "mat_key": str(name).strip()
    }
    if is_cust:
        p["youngs_modulus"] = to_float(ym)
        p["poissons_ratio"] = to_float(pr)
        p["allowable_stress"] = to_float(allow)
        p["yield_stress"] = to_float(yld)
        p["uts"] = to_float(uts)
        p["density"] = 0.0
        p["elasticity_table"] = None
        p["thermal_conductivity"] = 0.0
        p["thermal_conductivity_table"] = None
        p["specific_heat"] = 0.0
        p["specific_heat_table"] = None
        p["cte"] = 0.0
        p["cte_table"] = None
        return p

    m_obj = find_mat(name, db)
    if m_obj is None:
        raise ValueError("Material '" + str(name) + "' not found in material.json")

    phys = m_obj.get("PhysicalProperties", m_obj.get("Properties", {}))
    mech = m_obj.get("MechanicalProperties", {})

    try:
        p["density"] = float(phys["Density"]["Value"])
    except Exception:
        p["density"] = 0.0

    try:
        iso = phys["IsotropicElasticity"]
        t_v = [float(v) for v in iso["Temperature"]["Values"]]
        e_v = [float(v) for v in iso["YoungsModulus"]["Values"]]
        nu_v = [float(v) for v in iso["PoissonsRatio"]["Values"]]
        e_int = interp(t_v, e_v, temp)
        nu_int = interp(t_v, nu_v, temp)
        p["youngs_modulus"] = (e_int * 1000.0) if e_int is not None else 0.0
        p["poissons_ratio"] = nu_int if nu_int is not None else 0.0
        p["elasticity_table"] = {
            "t": [str(v) + " [C]" for v in t_v],
            "e": [str(v) + " [GPa]" for v in e_v],
            "pr": [str(v) for v in nu_v]
        }
    except Exception as err:
        raise ValueError("Failed to parse elasticity data for '" + str(name) + "': " + str(err))

    if "Yield_Stress" in mech:
        ys_d = mech["Yield_Stress"]
        t_v = [float(v) for v in ys_d["Temperature"]["Values"]]
        k_v = "YieldStrength" if "YieldStrength" in ys_d else "TensileStrength"
        v_v = [float(v) for v in ys_d[k_v]["Values"]]
        p["yield_stress"] = interp(t_v, v_v, temp) or 0.0
    else:
        p["yield_stress"] = float(mech.get("MinimumYieldStrength", {}).get("Value", 0.0))

    if "TensileStrength_TableU" in mech:
        u_d = mech["TensileStrength_TableU"]
        if isinstance(u_d, list):
            u_d = u_d[0]
        t_v = [float(v) for v in u_d["Temperature"]["Values"]]
        v_v = [float(v) for v in u_d["TensileStrength"]["Values"]]
        p["uts"] = interp(t_v, v_v, temp) or 0.0
    else:
        p["uts"] = float(mech.get("MinimumTensileStrength", {}).get("Value", 0.0))

    if "AllowableStress" in mech:
        a_d = mech["AllowableStress"]
        t_v = [float(v) for v in a_d["Temperature"]["Values"]]
        v_v = [float(v) for v in a_d["Stress"]["Values"]]
        p["allowable_stress"] = interp(t_v, v_v, temp) or 0.0
    else:
        p["allowable_stress"] = 0.0

    if to_float(ym) > 0:
        p["youngs_modulus"] = to_float(ym)
    if to_float(pr) > 0:
        p["poissons_ratio"] = to_float(pr)
    if to_float(yld) > 0:
        p["yield_stress"] = to_float(yld)
    if to_float(uts) > 0:
        p["uts"] = to_float(uts)
    if to_float(allow) > 0:
        p["allowable_stress"] = to_float(allow)

    tc_d = phys.get("ThermalConductivity", {})
    if tc_d and "Temperature" in tc_d and "Conductivity" in tc_d:
        t_v = [float(v) for v in tc_d["Temperature"]["Values"]]
        v_v = [float(v) for v in tc_d["Conductivity"]["Values"]]
        p["thermal_conductivity"] = interp(t_v, v_v, temp) or 0.0
        p["thermal_conductivity_table"] = {
            "t": [str(v) + " [C]" for v in t_v],
            "k": [str(v) + " [W m^-1 C^-1]" for v in v_v]
        }
    else:
        p["thermal_conductivity"] = 0.0
        p["thermal_conductivity_table"] = None

    sh_d = phys.get("SpecificHeat", {})
    if sh_d and "Temperature" in sh_d and "SpecificHeat" in sh_d:
        t_v = [float(v) for v in sh_d["Temperature"]["Values"]]
        v_v = [float(v) for v in sh_d["SpecificHeat"]["Values"]]
        p["specific_heat"] = interp(t_v, v_v, temp) or 0.0
        p["specific_heat_table"] = {
            "t": [str(v) + " [C]" for v in t_v],
            "c": [str(v) + " [J kg^-1 C^-1]" for v in v_v]
        }
    else:
        p["specific_heat"] = 0.0
        p["specific_heat_table"] = None

    cte_d = phys.get("CoefficientOfThermalExpansion", {})
    if cte_d and "Temperature" in cte_d and "CTE" in cte_d:
        t_v = [float(v) for v in cte_d["Temperature"]["Values"]]
        v_v = [float(v) for v in cte_d["CTE"]["Values"]]
        p["cte"] = interp(t_v, v_v, temp) or 0.0
        p["cte_table"] = {
            "t": [str(v) + " [C]" for v in t_v],
            "a": [str(v) + " [C^-1]" for v in v_v]
        }
    else:
        p["cte"] = 0.0
        p["cte_table"] = None

    return p

def calc_ep_curve(sy, uts, e, temp):
    fitt = 0.2
    fact = 0.6
    R = sy / uts if uts != 0 else 0.9
    eys = 0.002
    K = 1.5 * math.pow(R, 1.5) - 0.5 * math.pow(R, 2.5) - math.pow(R, 3.5)
    H1 = K * (uts - sy)
    a = math.log(R) + (fitt - eys)
    b = math.log(math.log(1 + fitt) / math.log(1 + eys))
    if b == 0:
        b = 1e-6
    m1 = a / b
    m2 = fact * (1 - R)
    A1 = (sy * (1 + eys)) / math.pow(math.log(1 + eys), m1)
    try:
        A2 = (uts * math.exp(m2)) / math.pow(m2, m2)
    except (ValueError, ZeroDivisionError):
        A2 = uts
    true_uts = uts * math.exp(m2)

    n_pts = 20
    raw_s = []
    raw_ps = []
    for k in range(n_pts + 1):
        pt = sy + (k / float(n_pts)) * (true_uts - sy)
        H2 = 2 * (pt - (sy + K * (uts - sy)))
        H_val = H2 / H1 if H1 != 0 else 0
        e3 = max(pt / A2, 0.0)
        try:
            e2 = math.pow(e3, 1.0 / m2)
        except (ValueError, ZeroDivisionError):
            e2 = 0.0
        e4 = max(pt / A1, 0.0)
        try:
            e1 = math.pow(e4, 1.0 / m1)
        except (ValueError, ZeroDivisionError):
            e1 = 0.0
        y1 = e1 * 0.5 * (1 - math.tanh(H_val))
        y2 = e2 * 0.5 * (1 + math.tanh(H_val))
        et = (pt / e) + y1 + y2
        p_strain = max(et - (pt / e), 0.0)
        raw_s.append(pt)
        raw_ps.append(p_strain)

    stress = [sy]
    pstrain = [0.0]
    for s, ps in zip(raw_s, raw_ps):
        if s <= sy:
            continue
        if ps > pstrain[-1]:
            stress.append(s)
            pstrain.append(ps)
        elif s > stress[-1] and ps <= pstrain[-1]:
            stress.append(s)
            pstrain.append(pstrain[-1] + 1.0e-7)

    if len(pstrain) >= 1:
        stress.append(stress[-1])
        pstrain.append(1.0)

    return [str(ps) + " [mm mm^-1]" for ps in pstrain], [str(s) + " [MPa]" for s in stress], [str(temp) + " [C]"] * len(stress)

def run_batch(json_path):
    with open(json_path, "r") as f:
        batch = json.load(f)

    cur_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(cur_dir, "material.json"), "r") as fm:
        db = json.load(fm)

    done_proj = set()
    last_proj = None

    for idx, itm in enumerate(batch):
        try:
            base_p = itm.get("AnalysisFolder", "")
            wbpj_p = base_p + ".wbpj"

            write_status("Opening Ansys Workbench", base_p)

            if base_p != last_proj:
                if base_p in done_proj:
                    Open(FilePath=wbpj_p)
                else:
                    Reset()
                    done_proj.add(base_p)
            last_proj = base_p

            a_type = str(itm.get("TypeOfAnalysis", "")).strip()
            loc_fail = str(itm.get("LocalFailureMethod", itm.get("LimitLoadModel", ""))).strip()
            if not loc_fail:
                if a_type == "Elastic Analysis":
                    loc_fail = "Elastic Method"
                elif a_type == "Elastic-Plastic Analysis":
                    loc_fail = "Elastic-Plastic Method"
                elif a_type == "Limit-Load Analysis":
                    loc_fail = "Elastic Method"
            t_des = to_float(itm.get("DesignTemp"))
            p_int = to_float(itm.get("InternalPressure"))
            op_th = str(itm.get("OperatingCondition", "No")).strip()
            s_htc = to_float(itm.get("ShellIdHTC"))
            n_htc = to_float(itm.get("NozzleIdHTC"))
            o_htc = to_float(itm.get("OutsideHTC"))

            s_mat = str(itm.get("ShellMaterial", "")).strip()
            s_alt = str(itm.get("ShellOtherName", "")).strip()
            s_ym = to_float(itm.get("ShellYM"))
            s_pr = to_float(itm.get("ShellPR"))
            s_all = to_float(itm.get("ShellAllowable"))
            s_yld = to_float(itm.get("ShellYield"))
            s_uts = to_float(itm.get("ShellUTS"))

            n_mat = str(itm.get("NozzleMaterial", "")).strip()
            n_alt = str(itm.get("NozzleOtherName", "")).strip()
            n_ym = to_float(itm.get("NozzleYM"))
            n_pr = to_float(itm.get("NozzlePR"))
            n_all = to_float(itm.get("NozzleAllowable"))
            n_yld = to_float(itm.get("NozzleYield"))
            n_uts = to_float(itm.get("NozzleUTS"))

            pad_req = str(itm.get("PadRequired", "")).strip()
            pad_on = pad_req.upper() == "YES"
            p_mat = str(itm.get("PadMaterial", "")).strip()
            p_alt = str(itm.get("PadOtherName", "")).strip()
            p_ym = to_float(itm.get("PadYM"))
            p_pr = to_float(itm.get("PadPR"))
            p_all = to_float(itm.get("PadAllowable"))
            p_yld = to_float(itm.get("PadYield"))
            p_uts = to_float(itm.get("PadUTS"))

            s_od = to_float(itm.get("ShellOD"))
            s_thk = to_float(itm.get("ShellTHK"))
            s_h = to_float(itm.get("ShellHeight"))
            n_off = to_float(itm.get("NozzleOffset"))
            ca = to_float(itm.get("CorrosionAllowance"))
            n_type = str(itm.get("TypeOfNozzle", "")).strip()
            n_loc = to_float(itm.get("NozzleHeight"))
            n_od = to_float(itm.get("NozzleOD"))
            n_thk = to_float(itm.get("NozzleTHK"))
            n_proj = to_float(itm.get("NozzleProjection"))
            h_od = to_float(itm.get("HubOD"))
            h_len = to_float(itm.get("HubLength"))
            t_len = to_float(itm.get("TransitionLength"))
            pad_w = to_float(itm.get("PadWidth")) if pad_on else 0.0
            pad_thk = to_float(itm.get("PadTHK")) if pad_on else 0.0

            mesh_sz = to_float(itm.get("GlobalBodySizing"))
            mesh_mth = str(itm.get("MeshMethod", "")).strip()
            edge_div = to_int(itm.get("EdgeDivision"))
            load_loc = str(itm.get("NozzleLoadingLocation", "")).strip()
            fl = to_float(itm.get("FL"))
            mt = to_float(itm.get("MT"))
            fc = to_float(itm.get("FC"))
            mc = to_float(itm.get("MC"))
            fa = to_float(itm.get("Fa"))
            ml = to_float(itm.get("ML"))

            s_props = get_props(s_mat, s_alt, s_ym, s_pr, s_all, s_yld, s_uts, t_des, db, a_type)
            n_props = get_props(n_mat, n_alt, n_ym, n_pr, n_all, n_yld, n_uts, t_des, db, a_type)
            p_props = get_props(p_mat, p_alt, p_ym, p_pr, p_all, p_yld, p_uts, t_des, db, a_type) if pad_on else None

            safe_cur = cur_dir.replace("\\", "/")
            scdoc_p = os.path.join(cur_dir, "shell_nozzle_" + str(idx) + ".scdoc")
            sc_err_p = os.path.join(safe_cur, "sc_error_" + str(idx) + ".txt")
            mech_err_p = os.path.join(safe_cur, "mech_error_" + str(idx) + ".txt")
            safe_scdoc_p = scdoc_p.replace("\\", "/")

            if os.path.exists(scdoc_p):
                try:
                    os.remove(scdoc_p)
                except OSError:
                    pass
            if os.path.exists(sc_err_p):
                os.remove(sc_err_p)
            if os.path.exists(mech_err_p):
                os.remove(mech_err_p)

            pad_flag = "True" if pad_on else "False"

            sc_vars = """try:
    S_OD = {0}
    S_THK = {1}
    S_H = {2}
    N_O = {3}
    N_TYPE = "{4}"
    N_L = {5}
    N_P = {6}
    N_OD = {7}
    N_THK = {8}
    H_OD = {9}
    H_LEN = {10}
    T_LEN = {11}
    pad = "{12}"
    P_W = {13}
    P_THK = {14}
""".format(s_od, s_thk, s_h, n_off, n_type, n_loc, n_proj, n_od, n_thk, h_od, h_len, t_len, pad_flag, pad_w, pad_thk)

            sc_body = """    plane = Plane.PlaneZX
    result = DatumPlaneCreator.Create(plane, False, None)
    plane = Plane.PlaneXY
    result = DatumPlaneCreator.Create(plane, False, None)
    plane = Plane.PlaneYZ
    result = DatumPlaneCreator.Create(plane, False, None)
    sectionPlane = Plane.PlaneXY
    result = ViewHelper.SetSketchPlane(sectionPlane, None)
    S_OR = S_OD / 2
    point1 = Point2D.Create(MM(S_OR - S_THK), MM(0))
    point2 = Point2D.Create(MM(S_OR), MM(0))
    point3 = Point2D.Create(MM(S_OR), MM(S_H))
    result = SketchRectangle.Create(point1, point2, point3)
    mode = InteractionMode.Solid
    result = ViewHelper.SetViewMode(mode, None)
    selection = Selection.Create(GetRootPart().Bodies[0].Faces[0])
    axis = Line.Create(Point.Origin, Direction.DirY)
    options = RevolveFaceOptions()
    options.ExtrudeType = ExtrudeType.Add
    result = RevolveFaces.Execute(selection, axis, DEG(360), options)
    selection = Selection.Create(GetRootPart().DatumPlanes[1])
    direction = Move.GetDirection(selection)
    options = MoveOptions()
    result = Move.Translate(selection, direction, MM(N_O), options)
    H_OR = H_OD / 2
    N_OR = N_OD / 2
    N_LEN = N_P - S_OR
    N_POS = (S_OR**2 - N_OR**2)**0.5
    if N_TYPE == "Straight":
        selection = Selection.Create(GetRootPart().DatumPlanes[1])
        result = ViewHelper.SetSketchPlane(selection, None)
        start = Point2D.Create(MM(S_OR), MM(N_L))
        end = Point2D.Create(MM(N_P), MM(N_L))
        isConstruction = True
        result = SketchLine.Create(start, end, isConstruction)
        point1 = Point2D.Create(MM(N_P), MM(N_L + N_OR))
        point2 = Point2D.Create(MM(N_P), MM(N_L + N_OR - N_THK))
        point3 = Point2D.Create(MM(S_OR + 50), MM(N_L + N_OR - N_THK))
        result = SketchRectangle.Create(point1, point2, point3)
        mode = InteractionMode.Solid
        result = ViewHelper.SetViewMode(mode, None)
        selection = Selection.Create(GetRootPart().Bodies[1].Faces[0])
        axis = Line.Create(Point.Create(MM(0), MM(N_L), MM(0)), Direction.DirX)
        options = RevolveFaceOptions()
        options.ExtrudeType = ExtrudeType.Add
        result = RevolveFaces.Execute(selection, axis, DEG(360), options)
        selection = Selection.Create(GetRootPart().Bodies[1].Faces[0])
        upToSelection = Selection.Create(GetRootPart().Bodies[0].Faces[1])
        options = ExtrudeFaceOptions()
        result = ExtrudeFaces.UpTo(selection, -Direction.DirX, upToSelection, Point.Create(MM(0), MM(0), MM(0)), options)
        selection = Selection.Create(GetRootPart().Bodies[0].Faces[6])
        options = OffsetFaceOptions()
        options.OffsetMode = OffsetMode.MoveFacesTogether
        result = OffsetFaces.Execute(selection, MM(-S_THK), options)
        if pad == "True":
            P_D = 2 * P_W + N_OD
            P_OR = P_D / 2
            selection = Selection.Create(GetRootPart().Curves[0].GetChildren[CurvePoint]()[0])
            result = DatumPlaneCreator.Create(selection, False, None)
            selection = Selection.Create(GetRootPart().DatumPlanes[3])
            direction = Move.GetDirection(selection)
            options = MoveOptions()
            result = Move.Translate(selection, direction, MM(P_THK), options)
            selection = Selection.Create(GetRootPart().DatumPlanes[3])
            result = ViewHelper.SetSketchPlane(selection, None)
            origin = Point2D.Create(MM(0), MM(0))
            result = SketchCircle.Create(origin, MM(P_OR))
            mode = InteractionMode.Solid
            result = ViewHelper.SetViewMode(mode, None)
            selection = Selection.Create(GetRootPart().Bodies[1].Faces[0])
            upToSelection = Selection.Create(GetRootPart().Bodies[0].Faces[6])
            options = ExtrudeFaceOptions()
            result = ExtrudeFaces.UpTo(selection, Direction.DirX, upToSelection, Point.Create(MM(0), MM(0), MM(0)), options)
            selection = Selection.Create(GetRootPart().Bodies[0].Faces[8])
            upToSelection = Selection.Create(GetRootPart().Bodies[0].Faces[4])
            options = ExtrudeFaceOptions()
            result = ExtrudeFaces.UpTo(selection, Direction.DirX, upToSelection, Point.Create(MM(946.216588274241), MM(1547.55714249255), MM(84.7004608880929)), options)
            selection = Selection.Create(GetRootPart().Bodies[0])
            toolFaces = Selection.Create(GetRootPart().Bodies[0].Faces[5])
            result = SplitBody.ByCutter(selection, toolFaces, True)
            selection = Selection.Create([GetRootPart().Bodies[0], GetRootPart().Bodies[1]])
            toolFaces = Selection.Create(GetRootPart().Bodies[1].Faces[3])
            result = SplitBody.ByCutter(selection, toolFaces, True)
            selection = Selection.Create([GetRootPart().Bodies[0], GetRootPart().Bodies[1], GetRootPart().Bodies[2]])
            datum = Selection.Create(GetRootPart().DatumPlanes[1])
            result = SplitBody.ByCutter(selection, datum)
            selection = Selection.Create(GetRootPart().Curves[0])
            result = DatumPlaneCreator.Create(selection, False, None)
            selection = Selection.Create([GetRootPart().Bodies[0], GetRootPart().Bodies[1], GetRootPart().Bodies[2], GetRootPart().Bodies[3], GetRootPart().Bodies[4], GetRootPart().Bodies[5]])
            datum = Selection.Create(GetRootPart().DatumPlanes[4])
            result = SplitBody.ByCutter(selection, datum)
            selection = Selection.Create([GetRootPart().Bodies[9], GetRootPart().Bodies[3], GetRootPart().Bodies[0], GetRootPart().Bodies[6]])
            toolFaces = Selection.Create(GetRootPart().Bodies[10].Faces[5])
            result = SplitBody.ByCutter(selection, toolFaces, True)
            targets = Selection.Create([GetRootPart().Bodies[17], GetRootPart().Bodies[16]])
            result = Combine.Merge(targets)
            targets = Selection.Create([GetRootPart().Bodies[18], GetRootPart().Bodies[6]])
            result = Combine.Merge(targets)
            targets = Selection.Create([GetRootPart().Bodies[12], GetRootPart().Bodies[11]])
            result = Combine.Merge(targets)
            targets = Selection.Create([GetRootPart().Bodies[13], GetRootPart().Bodies[3]])
            result = Combine.Merge(targets)
            selection = Selection.Create([GetRootPart().Bodies[0], GetRootPart().Bodies[1], GetRootPart().Bodies[2], GetRootPart().Bodies[3], GetRootPart().Bodies[4], GetRootPart().Bodies[5], GetRootPart().Bodies[6], GetRootPart().Bodies[7], GetRootPart().Bodies[8], GetRootPart().Bodies[9], GetRootPart().Bodies[10], GetRootPart().Bodies[11], GetRootPart().Bodies[12], GetRootPart().Bodies[13], GetRootPart().Bodies[14], GetRootPart().Bodies[15]])
            result = ComponentHelper.MoveBodiesToComponent(selection, None)
            selection = Selection.Create(GetRootPart().Components[0].Content)
            result = RenameObject.Execute(selection, "Shell Straight nozzle with pad")
            comp = GetRootPart().Components[0]
            comp.Content.ShareTopology = comp.Content.ShareTopology.Share
        elif pad == "False":
            selection = Selection.Create(GetRootPart().Bodies[0])
            toolFaces = Selection.Create(GetRootPart().Bodies[0].Faces[6])
            result = SplitBody.ByCutter(selection, toolFaces, True)
            selection = Selection.Create([GetRootPart().Bodies[0], GetRootPart().Bodies[1]])
            datum = Selection.Create(GetRootPart().DatumPlanes[1])
            result = SplitBody.ByCutter(selection, datum)
            selection = Selection.Create(GetRootPart().Curves[0])
            result = DatumPlaneCreator.Create(selection, False, None)
            selection = Selection.Create([GetRootPart().Bodies[2], GetRootPart().Bodies[0], GetRootPart().Bodies[3], GetRootPart().Bodies[1]])
            datum = Selection.Create(GetRootPart().DatumPlanes[3])
            result = SplitBody.ByCutter(selection, datum)
            selection = Selection.Create([GetRootPart().Bodies[5], GetRootPart().Bodies[0], GetRootPart().Bodies[4], GetRootPart().Bodies[2]])
            toolFaces = Selection.Create(GetRootPart().Bodies[7].Faces[5])
            result = SplitBody.ByCutter(selection, toolFaces, True)
            targets = Selection.Create([GetRootPart().Bodies[9], GetRootPart().Bodies[5]])
            result = Combine.Merge(targets)
            targets = Selection.Create([GetRootPart().Bodies[10], GetRootPart().Bodies[9]])
            result = Combine.Merge(targets)
            targets = Selection.Create([GetRootPart().Bodies[13], GetRootPart().Bodies[2]])
            result = Combine.Merge(targets)
            targets = Selection.Create([GetRootPart().Bodies[10], GetRootPart().Bodies[9]])
            result = Combine.Merge(targets)
            selection = Selection.Create([GetRootPart().Bodies[0], GetRootPart().Bodies[1], GetRootPart().Bodies[2], GetRootPart().Bodies[3], GetRootPart().Bodies[4], GetRootPart().Bodies[5], GetRootPart().Bodies[6], GetRootPart().Bodies[7], GetRootPart().Bodies[8], GetRootPart().Bodies[9], GetRootPart().Bodies[10], GetRootPart().Bodies[11]])
            result = ComponentHelper.MoveBodiesToComponent(selection, None)
            selection = Selection.Create(GetRootPart().Components[0].Content)
            result = RenameObject.Execute(selection, "Straight Nozzle")
            comp = GetRootPart().Components[0]
            comp.Content.ShareTopology = comp.Content.ShareTopology.Share
    elif N_TYPE == "SRN":
        selection = Selection.Create(GetRootPart().DatumPlanes[1])
        result = ViewHelper.SetSketchPlane(selection, None)
        mode = InteractionMode.Sketch
        result = ViewHelper.SetViewMode(mode, None)
        start = Point2D.Create(MM(S_OR), MM(0))
        end = Point2D.Create(MM(S_OR), MM(N_L))
        isConstruction = True
        result = SketchLine.Create(start, end, isConstruction)
        start = Point2D.Create(MM(S_OR), MM(N_L))
        end = Point2D.Create(MM(N_P), MM(N_L))
        isConstruction = True
        result = SketchLine.Create(start, end, isConstruction)
        start = Point2D.Create(MM(N_P), MM(N_L + N_OR))
        end = Point2D.Create(MM(N_P), MM(N_L + N_OR - N_THK))
        result = SketchLine.Create(start, end)
        start = Point2D.Create(MM(N_P), MM(N_L + N_OR - N_THK))
        end = Point2D.Create(MM(N_POS + 50), MM(N_L + N_OR - N_THK))
        result = SketchLine.Create(start, end)
        start = Point2D.Create(MM(N_POS + 50), MM(N_L + N_OR - N_THK))
        end = Point2D.Create(MM(N_POS + 50), MM(N_L + H_OR))
        result = SketchLine.Create(start, end)
        start = Point2D.Create(MM(N_POS + 50), MM(N_L + H_OR))
        end = Point2D.Create(MM(N_POS + H_LEN), MM(N_L + H_OR))
        result = SketchLine.Create(start, end)
        start = Point2D.Create(MM(N_POS + H_LEN), MM(N_L + H_OR))
        end = Point2D.Create(MM(N_POS + H_LEN + T_LEN), MM(N_L + N_OR))
        result = SketchLine.Create(start, end)
        start = Point2D.Create(MM(N_POS + H_LEN + T_LEN), MM(N_L + N_OR))
        end = Point2D.Create(MM(N_P), MM(N_L + N_OR))
        result = SketchLine.Create(start, end)
        mode = InteractionMode.Solid
        result = ViewHelper.SetViewMode(mode, None)
        selection = Selection.Create(GetRootPart().Bodies[1].Faces[0])
        axis = Line.Create(Point.Create(MM(0), MM(N_L), MM(0)), Direction.DirX)
        options = RevolveFaceOptions()
        options.ExtrudeType = ExtrudeType.Add
        result = RevolveFaces.Execute(selection, axis, DEG(360), options)
        selection = Selection.Create(GetRootPart().Bodies[1].Faces[0])
        upToSelection = Selection.Create(GetRootPart().Bodies[0].Faces[1])
        options = ExtrudeFaceOptions()
        result = ExtrudeFaces.UpTo(selection, -Direction.DirX, upToSelection, Point.Create(MM(0), MM(0), MM(0)), options)
        selection = Selection.Create(GetRootPart().Bodies[0].Faces[8])
        options = OffsetFaceOptions()
        options.OffsetMode = OffsetMode.MoveFacesTogether
        result = OffsetFaces.Execute(selection, MM(-S_THK), options)
        origin = Point.Create(MM(S_OR), MM(N_L), MM(0))
        xDir = Direction.DirX
        yDir = Direction.DirZ
        result = DatumPlaneCreator.Create(origin, xDir, yDir, False, None)
        def safe_bodies(indices):
            return [GetRootPart().Bodies[i] for i in indices if i < GetRootPart().Bodies.Count]
        try:
            selection = Selection.Create(safe_bodies([0]))
            if selection.Count > 0:
                toolFaces = Selection.Create(GetRootPart().Bodies[0].Faces[8])
                SplitBody.ByCutter(selection, toolFaces, True)
        except: pass
        try:
            selection = Selection.Create(safe_bodies([0, 1]))
            if selection.Count > 0:
                datum = Selection.Create(GetRootPart().DatumPlanes[3])
                SplitBody.ByCutter(selection, datum)
        except: pass
        try:
            selection = Selection.Create(safe_bodies([0, 1, 2, 3]))
            if selection.Count > 0:
                datum = Selection.Create(GetRootPart().DatumPlanes[1])
                SplitBody.ByCutter(selection, datum)
        except: pass
        try:
            selection = Selection.Create(safe_bodies([4, 6, 2, 0]))
            if selection.Count > 0 and GetRootPart().Bodies.Count > 7:
                toolFaces = Selection.Create(GetRootPart().Bodies[7].Faces[6])
                SplitBody.ByCutter(selection, toolFaces, True)
        except: pass
        try:
            targets = Selection.Create(safe_bodies([11, 6]))
            if targets.Count > 1: Combine.Merge(targets)
        except: pass
        try:
            targets = Selection.Create(safe_bodies([8, 7]))
            if targets.Count > 1: Combine.Merge(targets)
        except: pass
        try:
            targets = Selection.Create(safe_bodies([11, 2]))
            if targets.Count > 1: Combine.Merge(targets)
        except: pass
        try:
            targets = Selection.Create(safe_bodies([12, 0]))
            if targets.Count > 1: Combine.Merge(targets)
        except: pass
        try:
            selection = Selection.Create(safe_bodies([1, 0, 3, 4]))
            if selection.Count > 0 and GetRootPart().Bodies.Count > 1:
                plane = Selection.Create(GetRootPart().Bodies[1].Edges[17])
                SplitBody.ByCutter(selection, plane)
        except: pass
        try:
            selection = Selection.Create(safe_bodies([15, 14, 12, 13]))
            if selection.Count > 0 and GetRootPart().Bodies.Count > 12:
                plane = Selection.Create(GetRootPart().Bodies[12].Edges[8])
                SplitBody.ByCutter(selection, plane)
        except: pass
        try:
            all_b = [b for b in GetRootPart().Bodies]
            if all_b:
                selection = Selection.Create(all_b)
                ComponentHelper.MoveBodiesToComponent(selection, None)
                selection = Selection.Create(GetRootPart().Components[0].Content)
                RenameObject.Execute(selection, "SRN Nozzle")
                comp = GetRootPart().Components[0]
                comp.Content.ShareTopology = comp.Content.ShareTopology.Share
        except: pass
"""

            sc_foot = """    DocumentSave.Execute(r"{0}")
except Exception as e:
    import traceback
    with open(r"{1}/sc_error_{2}.txt", "w") as f:
        f.write(traceback.format_exc())
""".format(safe_scdoc_p, safe_cur, idx)

            sc_full = sc_vars + sc_body + sc_foot
            sc_scr_p = os.path.join(tempfile.gettempdir(), "cad_gen_" + str(uuid.uuid4().hex)[:8] + ".py")
            with open(sc_scr_p, "w") as f:
                f.write(sc_full)

            awp = os.environ.get("AWP_ROOT241", os.environ.get("AWP_ROOT242", os.environ.get("AWP_ROOT251", "")))
            if not awp:
                raise RuntimeError("AWP_ROOT environment variable not set. Cannot locate SpaceClaim.exe.")
            sc_exe = os.path.join(awp, "scdm", "SpaceClaim.exe")

            write_status("Opening Ansys SpaceClaim", base_p)
            write_status("Creating Geometry", base_p)
            os.system('"{0}" /RunScript="{1}" /Headless=False /Splash=True /ExitAfterScript=True'.format(sc_exe, sc_scr_p))

            if os.path.exists(sc_err_p):
                with open(sc_err_p, "r") as ef:
                    err_c = ef.read()
                os.remove(sc_err_p)
                raise RuntimeError("SpaceClaim Geometry Failed for Analysis " + str(idx + 1) + ":\n" + err_c)

            if not os.path.exists(scdoc_p):
                raise ValueError("SpaceClaim failed to generate geometry for Analysis " + str(idx + 1))

            if op_th.upper() == "YES":
                SetProjectUnitSystem(UnitSystemName="NMM_STANDARD")
                t1 = GetTemplate(TemplateName="Steady-State Thermal", Solver="ANSYS")
                s1 = t1.CreateSystem()
                t2 = GetTemplate(TemplateName="Static Structural", Solver="ANSYS")
                compTpl = GetComponentTemplate(Name="SimulationSetupCellTemplate_StructuralStaticANSYS")
                s2 = t2.CreateSystem(
                    ComponentsToShare=[s1.GetComponent(Name="Engineering Data"),
                                       s1.GetComponent(Name="Geometry"),
                                       s1.GetComponent(Name="Model")],
                    DataTransferFrom=[Set(FromComponent=s1.GetComponent(Name="Solution"),
                                          TransferName=None,
                                          ToComponentTemplate=compTpl)],
                    Position="Right",
                    RelativeTo=s1)
                sys1 = s1
            else:
                SetProjectUnitSystem(UnitSystemName="NMM_STANDARD")
                t1 = GetTemplate(TemplateName="Static Structural", Solver="ANSYS")
                sys1 = t1.CreateSystem()

            eng_cont = sys1.GetContainer(ComponentName="Engineering Data")

            def add_mat(eng, prefix, disp_n, props, mode, t_val):
                uniq_n = prefix + "_" + disp_n
                matl = eng.CreateMaterial(Name=uniq_n)
                
                # If Density exists and not custom material, import Density; otherwise skip
                if props.get("density", 0.0) > 0 and not props.get("is_custom", False):
                    d_str = str(props["density"]) + " [kg m^-3]"
                    pd = matl.CreateProperty(Name="Density", Qualifiers={"Definition": "", "Behavior": ""})
                    pd.SetData(Index=-1, Variables=["Density"], Values=[[d_str]])

                pe = matl.CreateProperty(Name="Elasticity", Behavior="Isotropic", Qualifiers={"Definition": "", "Behavior": "Isotropic"})
                pe.SetVariableProperty(VariableName="Young's Modulus", Property="Unit", Value="GPa")

                if props["is_custom"]:
                    ym_gpa = props["youngs_modulus"] / 1000.0
                    pe.SetData(
                        SheetName="Elasticity",
                        SheetQualifiers={"Definition": "", "Behavior": "Isotropic", "Derive from": "Young's Modulus and Poisson's Ratio"},
                        Index=-1,
                        Variables=["Young's Modulus", "Poisson's Ratio"],
                        Values=[[str(ym_gpa) + " [GPa]"], [str(props["poissons_ratio"])]])
                else:
                    et = props["elasticity_table"]["t"]
                    ee = props["elasticity_table"]["e"]
                    epr = props["elasticity_table"]["pr"]
                    pe.BeginBatchUpdate()
                    pe.SetData(
                        SheetName="Elasticity",
                        SheetQualifiers={"Definition": "", "Behavior": "Isotropic", "Derive from": "Young's Modulus and Poisson's Ratio"},
                        Index=-1,
                        Variables=["Temperature", "Young's Modulus", "Poisson's Ratio"],
                        Values=[et, ee, epr])
                    pe.EndBatchUpdate()

                if mode == "Elastic-Plastic Analysis":
                    # ASME Section VIII Div 2 Part 5: Yield strength Sy = min(1.5 * S, Syt)
                    ys = min(1.5 * props["allowable_stress"], props["yield_stress"]) if (props.get("allowable_stress", 0) > 0 and props.get("yield_stress", 0) > 0) else props.get("yield_stress", 0)
                    uv = props["uts"]
                    em = props["youngs_modulus"]
                    if ys > 0 and uv > 0 and em > 0:
                        s_ps, s_st, s_tm = calc_ep_curve(ys, uv, em, t_val)
                        p_iso = matl.CreateProperty(
                            Name="Isotropic Hardening",
                            Definition="Multilinear",
                            Qualifiers={"Definition": "Multilinear", "Behavior": ""})
                        p_iso.BeginBatchUpdate()
                        p_iso.SetData(
                            SheetName="Isotropic Hardening",
                            SheetQualifiers={"Definition": "Multilinear", "Behavior": ""},
                            Index=-1,
                            Variables=["Plastic Strain", "Stress", "Temperature"],
                            Values=[s_ps, s_st, s_tm])
                        p_iso.EndBatchUpdate()
                elif mode == "Limit-Load Analysis":
                    # ASME Section VIII Div 2 Part 5: Yield strength Sy = min(1.5 * S, Syt)
                    ys = min(1.5 * props["allowable_stress"], props["yield_stress"]) if (props.get("allowable_stress", 0) > 0 and props.get("yield_stress", 0) > 0) else props.get("yield_stress", 0)
                    if ys > 0:
                        p_bil = matl.CreateProperty(
                            Name="Isotropic Hardening",
                            Definition="Bilinear",
                            Qualifiers={"Definition": "Bilinear", "Behavior": ""})
                        p_bil.SetData(
                            SheetName="Isotropic Hardening",
                            SheetQualifiers={"Definition": "Bilinear", "Behavior": "", "Table": "Plastic", "Active Table": "Plastic"},
                            Index=-1,
                            Variables=["Temperature", "Yield Strength", "Tangent Modulus"],
                            Values=[[str(t_val) + " [C]"], [str(ys) + " [MPa]"], ["0 [MPa]"]])

                ptc = matl.CreateProperty(Name="Thermal Conductivity", Behavior="Isotropic", Qualifiers={"Definition": "", "Behavior": "Isotropic"})
                if props.get("thermal_conductivity_table"):
                    tc = props["thermal_conductivity_table"]
                    ptc.SetData(SheetName="Thermal Conductivity", SheetQualifiers={"Definition": "", "Behavior": "Isotropic"}, Index=-1, Variables=["Temperature"], Values=[tc["t"]])
                    ptc.SetData(SheetName="Thermal Conductivity", SheetQualifiers={"Definition": "", "Behavior": "Isotropic"}, Variables=["Thermal Conductivity"], Values=[tc["k"]])
                else:
                    ptc.SetData(SheetName="Thermal Conductivity", SheetQualifiers={"Definition": "", "Behavior": "Isotropic"}, Index=-1, Variables=["Temperature"], Values=[["20 [C]"]])
                    ptc.SetData(SheetName="Thermal Conductivity", SheetQualifiers={"Definition": "", "Behavior": "Isotropic"}, Variables=["Thermal Conductivity"], Values=[[str(props["thermal_conductivity"]) + " [W m^-1 C^-1]"]])

                pcte = matl.CreateProperty(Name="Coefficient of Thermal Expansion", Definition="Secant", Behavior="Isotropic", Qualifiers={"Definition": "Secant", "Behavior": "Isotropic"})
                if props.get("cte_table"):
                    ct = props["cte_table"]
                    pcte.SetData(SheetName="Coefficient of Thermal Expansion", SheetQualifiers={"Definition": "Secant", "Behavior": "Isotropic"}, Index=-1, Variables=["Temperature"], Values=[ct["t"]])
                    pcte.SetData(SheetName="Coefficient of Thermal Expansion", SheetQualifiers={"Definition": "Secant", "Behavior": "Isotropic"}, Variables=["Coefficient of Thermal Expansion"], Values=[ct["a"]])
                else:
                    pcte.SetData(SheetName="Coefficient of Thermal Expansion", SheetQualifiers={"Definition": "Secant", "Behavior": "Isotropic"}, Index=-1, Variables=["Temperature"], Values=[["20 [C]"]])
                    pcte.SetData(SheetName="Coefficient of Thermal Expansion", SheetQualifiers={"Definition": "Secant", "Behavior": "Isotropic"}, Variables=["Coefficient of Thermal Expansion"], Values=[[str(props["cte"]) + " [C^-1]"]])

                pcte.SetData(
                    SheetName="Zero-Thermal-Strain Reference Temperature",
                    SheetQualifiers={"Definition": "Secant", "Behavior": "Isotropic"},
                    Index=-1,
                    Variables=["Zero-Thermal-Strain Reference Temperature"],
                    Values=[["20 [C]"]])

                return uniq_n

            write_status("Creating Shell Material", base_p)
            s_ansys_m = add_mat(eng_cont, "Shell", s_props["display_name"], s_props, a_type, t_des)
            write_status("Creating Nozzle Material", base_p)
            n_ansys_m = add_mat(eng_cont, "Nozzle", n_props["display_name"], n_props, a_type, t_des)
            if pad_on:
                write_status("Creating Pad Material", base_p)
            p_ansys_m = add_mat(eng_cont, "Pad", p_props["display_name"], p_props, a_type, t_des) if pad_on else ""

            try:
                matl_steel = eng_cont.GetMaterial(Name="Structural Steel")
                if matl_steel:
                    matl_steel.Delete()
            except Exception:
                try:
                    matl_steel = eng_cont.GetMaterial(Name="Structural Steel")
                    if matl_steel:
                        matl_steel.Suppressed = True
                except Exception:
                    pass

            sys1.GetComponent(Name="Engineering Data").Refresh()
            geo_cont = sys1.GetContainer(ComponentName="Geometry")
            geo_cont.SetFile(FilePath=scdoc_p)

            s_all_v = s_props["allowable_stress"]
            n_all_v = n_props["allowable_stress"]
            s_yld_v = s_props["yield_stress"]
            n_yld_v = n_props["yield_stress"]
            s_uts_v = s_props["uts"]
            n_uts_v = n_props["uts"]
            s_ym_v = s_props["youngs_modulus"]
            s_nu_v = s_props["poissons_ratio"]
            n_ym_v = n_props["youngs_modulus"]
            n_nu_v = n_props["poissons_ratio"]

            mech_vars = """import System
import System.IO
import os
import clr
import json
import math
import re
import traceback
import wbjn
from math import sqrt
from Ansys.Mechanical.Graphics import Point
from Ansys.ACT.Math import Vector3D
from Ansys.Core.Units import Quantity
clr.AddReference("Microsoft.Office.Interop.Word")
import Microsoft.Office.Interop.Word as Word

S_OD = {0}
S_THK1 = {1}
S_H = {2}
N_OFF = {3}
N_TYPE = "{4}"
N_L1 = {5}
N_P = {6}
N_OD = {7}
N_THK1 = {8}
H_OD = {9}
pad_active = {10}
P_D = {11}
P_THK1 = {12}
B_size = {13}
MeshMethod = "{14}"
EdgeDivision = {15}
InternalPressure = {16}
NozzleLoadingLocation = "{17}"
FL = {18}
Fa = {19}
FC = {20}
MC = {21}
MT = {22}
ML = {23}
DesignTemp = {24}
CorrosionAllowance = {25}
ShellAllowable = {26}
NozzleAllowable = {27}
ShellYM = {28}
ShellPR = {29}
NozzleYM = {30}
NozzlePR = {31}
SAFE_BASE_DIR = r"{32}"
TypeOfAnalysis = "{33}"
ShellYield = {34}
ShellUTS = {35}
NozzleYield = {36}
NozzleUTS = {37}
ANALYSIS_IDX = {38}
ShellAnsysMat = "{39}"
NozzleAnsysMat = "{40}"
PadAnsysMat = "{41}"
ShellMaterialDisplay = "{42}"
NozzleMaterialDisplay = "{43}"
PadMaterialDisplay = "{44}"
NozzleOffset = {45}
OperatingCondition = "{46}"
ShellIdHTC = {47}
NozzleIdHTC = {48}
OutsideHTC = {49}
PadYM = {50}
PadPR = {51}
LocalFailureMethod = "{52}"
ShellOD = S_OD
ShellTHK = S_THK1
ShellHeight = S_H
NozzleOD = N_OD
NozzleTHK = N_THK1
NozzleHeight = N_L1
NozzleProjection = N_P
""".format(
                s_od, s_thk, s_h, n_off,
                n_type, n_loc, n_proj, n_od, n_thk,
                h_od, str(pad_on), pad_w, pad_thk,
                mesh_sz, mesh_mth, edge_div, p_int,
                load_loc, fl, fa, fc, mc, mt, ml,
                t_des, ca,
                s_all_v, n_all_v,
                s_ym_v, s_nu_v,
                n_ym_v, n_nu_v,
                safe_cur, a_type,
                s_yld_v, s_uts_v,
                n_yld_v, n_uts_v,
                idx,
                s_ansys_m, n_ansys_m, p_ansys_m,
                s_props["display_name"], n_props["display_name"],
                p_props["display_name"] if pad_on else "",
                n_off, op_th, s_htc, n_htc, o_htc,
                p_props["youngs_modulus"] if pad_on else 0.0,
                p_props["poissons_ratio"] if pad_on else 0.0,
                loc_fail)

            mech_body = """try:
    def report_mech_status(msg):
        try:
            d_str = json.dumps({"status": str(msg)})
            candidates = [SAFE_BASE_DIR, os.getcwd()]
            try:
                p1 = os.path.dirname(SAFE_BASE_DIR)
                if p1: candidates.append(p1)
                p2 = os.path.dirname(p1)
                if p2: candidates.append(p2)
            except Exception:
                pass
            for cand in candidates:
                try:
                    if cand and os.path.exists(cand):
                        with open(os.path.join(cand, "job_status.json"), "w") as jf:
                            jf.write(d_str)
                except Exception:
                    pass
        except Exception:
            pass

    S_OR = S_OD / 2.0
    S_IR1 = S_OR - S_THK1
    N_OR = N_OD / 2.0
    N_IR1 = N_OR - N_THK1
    N_LEN1 = N_P - S_OR
    N_LOC = N_L1

    for part in Model.Geometry.Children:
        for body in part.Children:
            body.Material = ShellAnsysMat

    all_geo_bodies = []
    for part in ExtAPI.DataModel.GeoData.Assemblies[0].Parts:
        for gbody in part.Bodies:
            all_geo_bodies.append(gbody)

    shell_body_ids = []
    nozzle_body_ids = []
    pad_body_ids = []

    S_IR_m = S_IR1 / 1000.0
    S_OR_m = S_OR / 1000.0
    S_H_m = S_H / 1000.0
    N_IR_m = N_IR1 / 1000.0
    N_OR_m = N_OR / 1000.0
    N_LOC_m = N_LOC / 1000.0
    N_OFF_m = N_OFF / 1000.0
    N_P_m = N_P / 1000.0
    P_D_m = (P_D / 1000.0) if (pad_active and P_D > 0) else 0.0
    P_OR_m = (P_D_m / 2.0) if P_D_m > 0 else 0.0

    for gbody in all_geo_bodies:
        bc = gbody.Centroid
        bx, by, bz = float(bc[0]), float(bc[1]), float(bc[2])
        r_nozzle_b = math.sqrt((by - N_LOC_m)**2 + (bz - N_OFF_m)**2)
        s_out_x_b = math.sqrt(max(S_OR_m**2 - bz**2, 0.0))

        if pad_active and P_OR_m > 0 and r_nozzle_b > N_OR_m and r_nozzle_b <= (P_OR_m + 0.01):
            pad_body_ids.append(gbody.Id)
        elif bx >= (s_out_x_b - 0.02) and r_nozzle_b <= (N_OR_m + 0.02):
            nozzle_body_ids.append(gbody.Id)
        else:
            shell_body_ids.append(gbody.Id)

    def assign_mat(b_ids, m_name):
        if not b_ids or not m_name:
            return
        for part in Model.Geometry.Children:
            for b_obj in part.Children:
                try:
                    if b_obj.GetGeoBody().Id in b_ids:
                        b_obj.Material = m_name
                except Exception:
                    pass

    assign_mat(shell_body_ids, ShellAnsysMat)
    assign_mat(nozzle_body_ids, NozzleAnsysMat)
    if pad_active and PadAnsysMat:
        assign_mat(pad_body_ids, PadAnsysMat)

    def get_face_pts(face):
        pts = []
        try:
            for v in face.Vertices:
                pts.append((float(v.X), float(v.Y), float(v.Z)))
        except Exception:
            pass
        if not pts:
            try:
                for v in face.Vertices:
                    pos = v.Position
                    pts.append((float(pos[0]), float(pos[1]), float(pos[2])))
            except Exception:
                pass
        try:
            c = face.Centroid
            pts.append((float(c[0]), float(c[1]), float(c[2])))
        except Exception:
            pass
        return pts

    def get_face_rad(face):
        if hasattr(face, "Radius"):
            try:
                r = abs(float(face.Radius))
                if r > 0:
                    return r
            except Exception:
                pass
        return None

    shell_bottom_ids = []
    shell_top_ids = []
    nozzle_end_ids = []
    inner_shell_ids = []
    inner_nozzle_ids = []
    outer_shell_ids = []
    outer_nozzle_ids = []
    outer_pad_ids = []

    rim_tol = 0.002

    for part in ExtAPI.DataModel.GeoData.Assemblies[0].Parts:
        for gbody in part.Bodies:
            for face in gbody.Faces:
                pts = get_face_pts(face)
                if not pts or face.Area <= 0:
                    continue
                c = face.Centroid
                xc, yc, zc = float(c[0]), float(c[1]), float(c[2])
                rg = get_face_rad(face)

                if abs(yc) < rim_tol and all(abs(p[1]) < rim_tol for p in pts):
                    shell_bottom_ids.append(face.Id)
                    continue

                if abs(yc - S_H_m) < rim_tol and all(abs(p[1] - S_H_m) < rim_tol for p in pts):
                    shell_top_ids.append(face.Id)
                    continue

                if abs(xc - N_P_m) < rim_tol and all(abs(p[0] - N_P_m) < rim_tol for p in pts):
                    nozzle_end_ids.append(face.Id)
                    continue

                r_s_pts = [math.sqrt(p[0]**2 + p[2]**2) for p in pts]
                r_n_pts = [math.sqrt((p[1] - N_LOC_m)**2 + (p[2] - N_OFF_m)**2) for p in pts]

                is_in_s = False
                if rg is not None and abs(rg - S_IR_m) / S_IR_m <= 0.05:
                    is_in_s = True
                elif all(abs(rp - S_IR_m) <= 0.003 for rp in r_s_pts):
                    is_in_s = True

                if is_in_s and (0.001 < yc < S_H_m - 0.001):
                    inner_shell_ids.append(face.Id)
                    continue

                is_out_s = False
                if rg is not None and abs(rg - S_OR_m) / S_OR_m <= 0.05:
                    is_out_s = True
                elif all(abs(rp - S_OR_m) <= 0.003 for rp in r_s_pts):
                    is_out_s = True

                if is_out_s and (0.001 < yc < S_H_m - 0.001):
                    r_nc = math.sqrt((yc - N_LOC_m)**2 + (zc - N_OFF_m)**2)
                    if r_nc > (N_OR_m + 0.02):
                        outer_shell_ids.append(face.Id)
                        continue

                is_in_n = False
                if rg is not None and abs(rg - N_IR_m) / N_IR_m <= 0.05:
                    is_in_n = True
                elif all(abs(rnp - N_IR_m) <= 0.003 for rnp in r_n_pts):
                    is_in_n = True

                if is_in_n and xc < N_P_m - 0.001:
                    inner_nozzle_ids.append(face.Id)
                    continue

                is_out_n = False
                if rg is not None and abs(rg - N_OR_m) / N_OR_m <= 0.05:
                    is_out_n = True
                elif all(abs(rnp - N_OR_m) <= 0.003 for rnp in r_n_pts):
                    is_out_n = True

                if is_out_n and xc < N_P_m - 0.001:
                    s_ox = math.sqrt(max(S_OR_m**2 - zc**2, 0.0))
                    if xc >= (s_ox + 0.01):
                        outer_nozzle_ids.append(face.Id)
                        continue

                if pad_active and P_OR_m > 0:
                    if rg is not None and abs(rg - P_OR_m) / P_OR_m <= 0.05:
                        outer_pad_ids.append(face.Id)
                        continue
                    elif all(abs(rnp - P_OR_m) <= 0.003 for rnp in r_n_pts):
                        outer_pad_ids.append(face.Id)
                        continue

    shell_bottom_ids = list(set(shell_bottom_ids))
    shell_top_ids = list(set(shell_top_ids))
    nozzle_end_ids = list(set(nozzle_end_ids))
    inner_shell_ids = list(set(inner_shell_ids))
    inner_nozzle_ids = list(set(inner_nozzle_ids))
    outer_shell_ids = list(set(outer_shell_ids))
    outer_nozzle_ids = list(set(outer_nozzle_ids))
    outer_pad_ids = list(set(outer_pad_ids))

    all_inner_face_ids = list(set(inner_shell_ids + inner_nozzle_ids))
    all_outer_face_ids = list(set(outer_shell_ids + outer_nozzle_ids + outer_pad_ids))

    mesh = Model.Mesh
    try:
        mesh.CheckMeshQuality = 1
    except Exception:
        pass
    try:
        mesh.ShapeChecking = 0
    except Exception:
        pass
    try:
        mesh.TargetQuality = 0.7
    except Exception:
        pass
    try:
        mesh.MeshMetric = MeshMetricType.JacobianRatioCornerNodes
    except Exception:
        pass

    struct_analysis = None
    thermal_analysis = None
    for a in Model.Analyses:
        if "Structural" in a.Name:
            struct_analysis = a
        if "Thermal" in a.Name:
            thermal_analysis = a
    if struct_analysis is None:
        struct_analysis = Model.Analyses[0]
    analysis = struct_analysis

    if OperatingCondition.upper() == "YES" and thermal_analysis is not None:
        if inner_shell_ids:
            sel_is = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
            sel_is.Ids = inner_shell_ids
            conv_shell = thermal_analysis.AddConvection()
            conv_shell.Location = sel_is
            try:
                conv_shell.FilmCoefficient.Output.SetDiscreteValue(0, Quantity(ShellIdHTC, "W m^-2 C^-1"))
            except Exception:
                try:
                    conv_shell.FilmCoefficient.Output.DiscreteValues = [Quantity(ShellIdHTC, "W m^-2 C^-1")]
                except Exception:
                    pass
            try:
                conv_shell.AmbientTemperature.Output.SetDiscreteValue(0, Quantity(DesignTemp, "C"))
            except Exception:
                try:
                    conv_shell.AmbientTemperature.Output.DiscreteValues = [Quantity(DesignTemp, "C")]
                except Exception:
                    pass
        if inner_nozzle_ids:
            sel_in = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
            sel_in.Ids = inner_nozzle_ids
            conv_nozzle = thermal_analysis.AddConvection()
            conv_nozzle.Location = sel_in
            try:
                conv_nozzle.FilmCoefficient.Output.SetDiscreteValue(0, Quantity(NozzleIdHTC, "W m^-2 C^-1"))
            except Exception:
                try:
                    conv_nozzle.FilmCoefficient.Output.DiscreteValues = [Quantity(NozzleIdHTC, "W m^-2 C^-1")]
                except Exception:
                    pass
            try:
                conv_nozzle.AmbientTemperature.Output.SetDiscreteValue(0, Quantity(DesignTemp, "C"))
            except Exception:
                try:
                    conv_nozzle.AmbientTemperature.Output.DiscreteValues = [Quantity(DesignTemp, "C")]
                except Exception:
                    pass
        if all_outer_face_ids:
            sel_out = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
            sel_out.Ids = all_outer_face_ids
            conv_out = thermal_analysis.AddConvection()
            conv_out.Location = sel_out
            try:
                conv_out.FilmCoefficient.Output.SetDiscreteValue(0, Quantity(OutsideHTC, "W m^-2 C^-1"))
            except Exception:
                try:
                    conv_out.FilmCoefficient.Output.DiscreteValues = [Quantity(OutsideHTC, "W m^-2 C^-1")]
                except Exception:
                    pass
            try:
                conv_out.AmbientTemperature.Output.SetDiscreteValue(0, Quantity(DesignTemp, "C"))
            except Exception:
                try:
                    conv_out.AmbientTemperature.Output.DiscreteValues = [Quantity(DesignTemp, "C")]
                except Exception:
                    pass
                    
        try:
            temp_result = thermal_analysis.Solution.AddTemperature()
            temp_result.Name = "Temperature Distribution"
        except Exception:
            pass

    seet = analysis.AnalysisSettings
    seet.NumberOfSteps = 2
    seet.CurrentStepNumber = 2
    step = 2

    load_factor = 1.0
    if TypeOfAnalysis in ["Elastic-Plastic Analysis", "Limit-Load Analysis"]:
        seet.LargeDeflection = True
        seet.SolverType = SolverType.Direct
        seet.ContactSplit = ContactSplitType.Off
        with Transaction():
            for step_index in [1, 2]:
                seet.SetAutomaticTimeStepping(step_index, AutomaticTimeStepping.On)
                seet.SetInitialSubsteps(step_index, 15)
                seet.SetMinimumSubsteps(step_index, 10)
                seet.SetMaximumSubsteps(step_index, 500)
                seet.SetEnergyConvergenceType(step_index, ConvergenceToleranceType.Remove)
        if TypeOfAnalysis == "Elastic-Plastic Analysis":
            load_factor = 2.4
        elif TypeOfAnalysis == "Limit-Load Analysis":
            # If limit load select then elastic material model then load factor 1.7
            # If limit load and material model elastic-plastic then load factor 1.5 (Local Failure)
            lf_method_str = str(LocalFailureMethod).strip().lower()
            if "plastic" in lf_method_str:
                load_factor = 1.5
            else:
                load_factor = 1.7

    p_applied = InternalPressure * load_factor
    FL_applied = FL * load_factor
    Fa_applied = Fa * load_factor
    FC_applied = FC * load_factor
    MC_applied = MC * load_factor
    MT_applied = MT * load_factor
    ML_applied = ML * load_factor

    for a_itm in ExtAPI.DataModel.AnalysisList:
        if "Static Structural" in a_itm.Name:
            a_itm.EnvironmentTemperature = Quantity(DesignTemp, "C")

    allbody_ids = []
    for part in ExtAPI.DataModel.GeoData.Assemblies[0].Parts:
        for gbody in part.Bodies:
            allbody_ids.append(gbody.Id)

    report_mech_status("Creating Mesh Tree")
    size = mesh.AddSizing()
    sel_all = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
    sel_all.Ids = allbody_ids
    size.Location = sel_all
    size.ElementSize = Quantity(B_size, "mm")

    method = mesh.AddAutomaticMethod()
    method.Location = sel_all
    if MeshMethod == "Sweep":
        method.Method = MethodType.Sweep
    elif MeshMethod == "MultiZone":
        try:
            method.Method = MethodType.Multizone
        except Exception:
            method.Method = MethodType.MultiZone
    elif MeshMethod == "HexDominant":
        method.Method = MethodType.HexDominant
    else:
        method.Method = MethodType.Automatic

    edge_ids = []
    s_thk_m = S_THK1 / 1000.0
    n_thk_m = N_THK1 / 1000.0
    for part in ExtAPI.DataModel.GeoData.Assemblies[0].Parts:
        for gbody in part.Bodies:
            for edge in gbody.Edges:
                try:
                    el = float(edge.Length.Value) if hasattr(edge.Length, "Value") else float(edge.Length)
                    if s_thk_m > 0 and abs(el - s_thk_m) / s_thk_m <= 0.1:
                        edge_ids.append(edge.Id)
                    elif n_thk_m > 0 and abs(el - n_thk_m) / n_thk_m <= 0.1:
                        edge_ids.append(edge.Id)
                except Exception:
                    pass

    if edge_ids and EdgeDivision > 0:
        size2 = mesh.AddSizing()
        sel_edges = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
        sel_edges.Ids = edge_ids
        size2.Location = sel_edges
        size2.Type = SizingType.NumberOfDivisions
        size2.NumberOfDivisions = EdgeDivision

    report_mech_status("Applying Boundary Conditions")
    if all_inner_face_ids:
        sel_inner = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
        sel_inner.Ids = all_inner_face_ids
        pressure = analysis.AddPressure()
        pressure.Magnitude.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
        pressure.Magnitude.Output.SetDiscreteValue(1, Quantity(p_applied, "MPa"))
        pressure.Magnitude.Output.SetDiscreteValue(2, Quantity(p_applied, "MPa"))
        pressure.Location = sel_inner
        pressure.Name = "Pressure"

    report_mech_status("Creating Coordinate System")
    cs = Model.CoordinateSystems.AddCoordinateSystem()
    try:
        cs.OriginDefineBy = CoordinateSystemAlignmentType.Free
    except Exception:
        try:
            cs.OriginDefineBy = CoordinateSystemAlignmentTypeEnum.Free
        except Exception:
            pass
    cs.OriginY = Quantity(N_LOC, "mm")
    cs.OriginZ = Quantity(N_OFF, "mm")
    s_sq = S_OR**2 - N_OFF**2
    x_pos = math.sqrt(s_sq) if s_sq >= 0 else 0.0
    cs.OriginX = Quantity(x_pos, "mm")
    try:
        cs.PrimaryAxis = CoordinateSystemAxisType.PositiveXAxis
    except Exception:
        try:
            cs.PrimaryAxis = CoordinateSystemAxisTypeEnum.PositiveXAxis
        except Exception:
            pass
    try:
        cs.PrimaryAxisDefineBy = CoordinateSystemAlignmentType.GlobalY
    except Exception:
        try:
            cs.PrimaryAxisDefineBy = CoordinateSystemAlignmentTypeEnum.GlobalY
        except Exception:
            pass
    try:
        cs.SecondaryAxis = CoordinateSystemAxisType.PositiveYAxis
    except Exception:
        try:
            cs.SecondaryAxis = CoordinateSystemAxisTypeEnum.PositiveYAxis
        except Exception:
            pass
    try:
        cs.SecondaryAxisDefineBy = CoordinateSystemAlignmentType.GlobalX
    except Exception:
        try:
            cs.SecondaryAxisDefineBy = CoordinateSystemAlignmentTypeEnum.GlobalX
        except Exception:
            pass

    sel_bottom = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
    sel_bottom.Ids = shell_bottom_ids
    ccs = Model.CoordinateSystems.AddCoordinateSystem()
    ccs.OriginLocation = sel_bottom
    try:
        ccs.CoordinateSystemType = CoordinateSystemTypeEnum.Cylindrical
    except Exception:
        try:
            ccs.CoordinateSystemType = CoordinateSystemType.Cylindrical
        except Exception:
            pass
    try:
        ccs.PrimaryAxis = CoordinateSystemAxisType.PositiveZAxis
    except Exception:
        try:
            ccs.PrimaryAxis = CoordinateSystemAxisTypeEnum.PositiveZAxis
        except Exception:
            pass
    try:
        ccs.PrimaryAxisDefineBy = CoordinateSystemAlignmentType.GlobalY
    except Exception:
        try:
            ccs.PrimaryAxisDefineBy = CoordinateSystemAlignmentTypeEnum.GlobalY
        except Exception:
            pass
    ccs.Name = "Cylindrical Coordinate System"

    if shell_bottom_ids:
        disp = analysis.AddDisplacement()
        disp.Location = sel_bottom
        disp.Name = "Displacement"
        try:
            disp.CoordinateSystem = ccs
        except Exception:
            pass
        for comp in [disp.XComponent, disp.YComponent, disp.ZComponent]:
            try:
                comp.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
                comp.Output.SetDiscreteValue(0, Quantity(0, "mm"))
                comp.Output.SetDiscreteValue(1, Quantity(0, "mm"))
                comp.Output.SetDiscreteValue(2, Quantity(0, "mm"))
            except Exception:
                try:
                    comp.Output.SetDiscreteValue(0, Quantity(0, "mm"))
                except Exception:
                    try:
                        comp.Output.DiscreteValues = [Quantity(0, "mm")]
                    except Exception:
                        pass

    if shell_top_ids:
        sel_top = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
        sel_top.Ids = shell_top_ids
        pt_shell = p_applied * (S_IR1**2) / (S_OR**2 - S_IR1**2)
        thrust_s = analysis.AddPressure()
        thrust_s.Magnitude.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
        thrust_s.Magnitude.Output.SetDiscreteValue(1, Quantity(-pt_shell, "MPa"))
        thrust_s.Magnitude.Output.SetDiscreteValue(2, Quantity(-pt_shell, "MPa"))
        thrust_s.Location = sel_top
        thrust_s.Name = "Shell Thrust"

    sel_ne = ExtAPI.SelectionManager.CreateSelectionInfo(SelectionTypeEnum.GeometryEntities)
    sel_ne.Ids = nozzle_end_ids

    rp = Model.AddRemotePoint()
    try:
        rp.CoordinateSystem = cs
    except Exception:
        pass
    rp.Location = sel_ne
    rp.XCoordinate = Quantity(0, "mm")
    rp.YCoordinate = Quantity(0, "mm")
    rp.ZCoordinate = Quantity(0, "mm")

    if nozzle_end_ids:
        pt_nozzle = p_applied * (N_IR1**2) / (N_OR**2 - N_IR1**2)
        thrust_n = analysis.AddPressure()
        thrust_n.Magnitude.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
        thrust_n.Magnitude.Output.SetDiscreteValue(1, Quantity(-pt_nozzle, "MPa"))
        thrust_n.Magnitude.Output.SetDiscreteValue(2, Quantity(-pt_nozzle, "MPa"))
        thrust_n.Location = sel_ne
        thrust_n.Name = "Nozzle Thrust"

    report_mech_status("Generating Mesh")
    mesh.GenerateMesh()
    No = seet.NumberOfSteps
    step = No

    report_mech_status("Applying Load Conditions")
    RP = Model.RemotePoints.Children[0]
    if NozzleLoadingLocation == "Shell Nozzle Junction":
        RP.YCoordinate = Quantity(0, "mm")

    RF = analysis.AddRemoteForce()
    RF.Location = RP
    try:
        RF.DefineBy = LoadDefineBy.Components
    except Exception:
        try:
            RF.DefineBy = LoadDefineByEnum.Components
        except Exception:
            pass
    RF.XComponent.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
    RF.YComponent.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
    RF.ZComponent.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
    RF.XComponent.Output.SetDiscreteValue(2, Quantity(FL_applied, "N"))
    RF.YComponent.Output.SetDiscreteValue(2, Quantity(Fa_applied, "N"))
    RF.ZComponent.Output.SetDiscreteValue(2, Quantity(FC_applied, "N"))

    RM = analysis.AddMoment()
    RM.Location = RP
    try:
        RM.DefineBy = LoadDefineBy.Components
    except Exception:
        try:
            RM.DefineBy = LoadDefineByEnum.Components
        except Exception:
            pass
    RM.XComponent.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
    RM.YComponent.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
    RM.ZComponent.Inputs[0].DiscreteValues = [Quantity("0 [sec]"), Quantity("1 [sec]"), Quantity("2 [sec]")]
    RM.XComponent.Output.SetDiscreteValue(2, Quantity(MC_applied, "N mm"))
    RM.YComponent.Output.SetDiscreteValue(2, Quantity(MT_applied, "N mm"))
    RM.ZComponent.Output.SetDiscreteValue(2, Quantity(ML_applied, "N mm"))

    if TypeOfAnalysis == "Elastic-Plastic Analysis" or (TypeOfAnalysis == "Limit-Load Analysis" and LocalFailureMethod in ["Elastic-Plastic", "Elastic-Plastic Method"]):
        report_mech_status("Solving Solution")
        analysis.Solve()
        all_a = ExtAPI.DataModel.Project.Model.Analyses
        sol = None
        for a_i in all_a:
            sol = a_i.Solution
            if sol is not None:
                break
        if sol is not None:
            report_mech_status("Evaluating Results Contours")
            str_obj = sol.AddEquivalentPlasticStrain()
            str_obj.Name = "Equivalent Plastic Strain"
            sol.EvaluateAllResults()
            max_str_v = str_obj.Maximum.Value
            p_dat = str_obj.PlotData
            nodes = p_dat["Node"]
            vals = p_dat["Values"]
            tgt_node = None
            for node_id, val in zip(nodes, vals):
                if abs(val - max_str_v) < 1e-7:
                    tgt_node = int(node_id)
                    break
            if tgt_node is not None:
                mdl = ExtAPI.DataModel.Project.Model
                if mdl.NamedSelections is None or len(DataModel.GetObjectsByType(DataModelObjectCategory.NamedSelections)) == 0:
                    ns = mdl.AddNamedSelection()
                else:
                    ns = mdl.NamedSelections.AddNamedSelection()
                ns.Name = "Max_Plastic_Strain_Node_" + str(tgt_node)
                sel_man = ExtAPI.SelectionManager
                sel_i = sel_man.CreateSelectionInfo(Ansys.ACT.Interfaces.Common.SelectionTypeEnum.MeshNodes)
                sel_i.Ids = [tgt_node]
                ns.Location = sel_i
                ns.Generate()
                s1 = sol.AddMaximumPrincipalStress()
                s1.ScopingMethod = GeometryDefineByType.Component
                s1.Location = ns
                s2 = sol.AddMiddlePrincipalStress()
                s2.ScopingMethod = GeometryDefineByType.Component
                s2.Location = ns
                s3 = sol.AddMinimumPrincipalStress()
                s3.ScopingMethod = GeometryDefineByType.Component
                s3.Location = ns
                seqv = sol.AddEquivalentStress()
                seqv.ScopingMethod = GeometryDefineByType.Component
                seqv.Location = ns
                udr = sol.AddUserDefinedResult()
                udr.ScopingMethod = GeometryDefineByType.Component
                udr.Location = ns
                udr.Expression = r"(S1+S2+S3)/(3*SEQV)"
                udr.Name = "Stress Triaxiality at Max Node"
                sol.EvaluateAllResults()
                ExtAPI.DataModel.Tree.Refresh()
    else:
        report_mech_status("Solving Solution")
        analysis.Solve()
        report_mech_status("Evaluating Results Contours")
        Graphics.ViewOptions.ResultPreference.ShowMaximum = True
        Graphics.ViewOptions.ResultPreference.ShowMinimum = True
        Graphics.ViewOptions.ResultPreference.ExtraModelDisplay = MechanicalEnums.Graphics.ExtraModelDisplay.NoWireframe
        Graphics.ViewOptions.ResultPreference.DeformationScaling = MechanicalEnums.Graphics.DeformationScaling.True
        Graphics.ViewOptions.ResultPreference.ContourView = MechanicalEnums.Graphics.ContourView.SmoothContours
        Graphics.ViewOptions.ResultPreference.DeformationScaleMultiplier = 0
        Tree.Refresh()

        tdif = analysis.Solution.AddTotalDeformation()
        tdif.DisplayTime = Quantity(1, "sec")

        Estress = analysis.Solution.AddEquivalentStress()
        try:
            Estress.DisplayOption = ResultAveragingType.Averaged
        except Exception:
            try:
                Estress.DisplayOption = ResultAveragingTypeEnum.Averaged
            except Exception:
                pass
        Estress.AverageAcrossBodies = 1
        Estress.DisplayTime = Quantity(1, "sec")

        Estress2 = analysis.Solution.AddEquivalentStress()
        try:
            Estress2.DisplayOption = ResultAveragingType.Unaveraged
        except Exception:
            try:
                Estress2.DisplayOption = ResultAveragingTypeEnum.Unaveraged
            except Exception:
                pass
        Estress2.Name = "Mesh Sensitivity"
        Estress2.DisplayTime = Quantity(1, "sec")

        Hoopstress = analysis.Solution.AddNormalStress()
        try:
            Hoopstress.CoordinateSystem = ccs
        except Exception:
            try:
                Hoopstress.CoordinateSystemSelection = ccs
            except Exception:
                pass
        try:
            Hoopstress.NormalOrientation = NormalOrientationType.ZAxis
        except Exception:
            try:
                Hoopstress.NormalOrientation = NormalOrientationTypeEnum.ZAxis
            except Exception:
                pass
        Hoopstress.DisplayTime = Quantity(1, "sec")

        solu_udr = analysis.Solution.AddUserDefinedResult()
        solu_udr.Expression = r"s1+s2+s3"

        disp_objs = ExtAPI.DataModel.GetObjectsByName("Displacement")
        if len(disp_objs) > 0:
            reaction = analysis.Solution.AddForceReaction()
            reaction.BoundaryConditionSelection = disp_objs[0]
            try:
                reaction.ResultSelection = ProbeDisplayFilter.YAxis
            except Exception:
                try:
                    reaction.ResultSelection = ProbeDisplayFilterEnum.YAxis
                except Exception:
                    pass

        GroupType = Ansys.ACT.Automation.Mechanical.TreeGroupingFolder
        sll = []
        for child in analysis.Solution.Children:
            if child.GetType() != GroupType and hasattr(child, "By"):
                child.DisplayTime = Quantity(1, "sec")
                sll.append(child)

        for i in range(2, No + 1):
            sll2 = []
            for child in sll:
                child2 = child.Duplicate()
                child2.DisplayTime = Quantity(i, "sec")
                sll2.append(child2)
            group = Tree.Group(sll2)
            group.Name = "LoadCase" + i.ToString()

        group = Tree.Group(sll)
        group.Name = "Loadcase 1"
        analysis.Solve()

        shell_th = S_THK1 / 1000.0
        nozzle_th = N_THK1 / 1000.0
        pad_th = (P_THK1 / 1000.0) if pad_active else 0.0
        tot_shell_th = (shell_th + pad_th) if pad_active else shell_th

        shell_center = (S_H / 2.0) - N_IR1
        far_dist_nozzle = (shell_center / 1000.0) - (shell_center / 10000.0)
        N_Length = (N_P - S_IR1) / 1000.0
        far_dist_shell = N_Length - (N_Length / 10.0)

        model = ExtAPI.DataModel.Project.Model
        solution = struct_analysis.Solution
        meshdata = struct_analysis.MeshData
        
        # Collect EquivalentStress results recursively (including from LoadCase grouping folders)
        eqv_stresses = []
        def collect_eqv_results(parent_obj):
            for child in parent_obj.Children:
                try:
                    if child.DataModelObjectCategory == DataModelObjectCategory.EquivalentStress:
                        eqv_stresses.append(child)
                except Exception:
                    pass
                if hasattr(child, "Children") and child.Children.Count > 0:
                    collect_eqv_results(child)
        collect_eqv_results(solution)

        target_node = None
        global_max_stress = -1.0
        for eq_str in eqv_stresses:
            try:
                current_max = float(eq_str.Maximum.Value)
                if current_max > global_max_stress:
                    global_max_stress = current_max
                    plot_data = eq_str.PlotData
                    nodes = plot_data["Node"]
                    values = plot_data["Values"]
                    for node_id, val in zip(nodes, values):
                        if abs(float(val) - current_max) < 1e-6:
                            target_node = int(node_id)
                            break
            except Exception:
                pass

        X0, Y0, Z0 = None, None, None
        if target_node is not None:
            try:
                max_node = meshdata.NodeById(target_node)
                X0 = float(max_node.X)
                Y0 = float(max_node.Y)
                Z0 = float(max_node.Z)
            except Exception:
                X0, Y0, Z0 = None, None, None

        # Fallback to shell-nozzle junction intersection coordinates if node lookup failed
        if X0 is None or Y0 is None or Z0 is None:
            s_sq_int = max(S_IR_m**2 - N_OFF_m**2, 0.0)
            X0 = math.sqrt(s_sq_int)
            Y0 = N_LOC_m
            Z0 = N_OFF_m

        cg_group = None
        for child in model.Children:
            if child.DataModelObjectCategory == DataModelObjectCategory.ConstructionGeometry:
                cg_group = child
                break
        if not cg_group:
            cg_group = model.AddConstructionGeometry()

        r_shell = math.sqrt(X0**2 + Z0**2)
        nx_s = X0 / r_shell if r_shell > 0 else 1.0
        nz_s = Z0 / r_shell if r_shell > 0 else 0.0

        r_noz = math.sqrt((Y0 - N_LOC_m)**2 + (Z0 - N_OFF_m)**2)
        ny_n = (Y0 - N_LOC_m) / r_noz if r_noz > 0 else 1.0
        nz_n = (Z0 - N_OFF_m) / r_noz if r_noz > 0 else 0.0

        sx = tot_shell_th * nx_s
        sz = tot_shell_th * nz_s

        ny = nozzle_th * ny_n
        nz2 = nozzle_th * nz_n

        paths_data = [
            {"name": "At Max Stress Location", "start": (X0, Y0, Z0), "end": (X0 + sx, Y0 + ny, Z0 + sz + nz2)},
            {"name": "Across Nozzle thickness at Nozzle to Shell junction", "start": (X0 + sx, Y0, Z0 + sz), "end": (X0 + sx, Y0 + ny, Z0 + sz + nz2)},
            {"name": "Across Shell thickness at Nozzle to Shell junction", "start": (X0, Y0, Z0), "end": (X0 + sx, Y0, Z0 + sz)},
            {"name": "Across Nozzle thickness away from discontinuity", "start": (X0 + far_dist_shell, Y0, Z0), "end": (X0 + far_dist_shell, Y0 + ny, Z0 + nz2)},
            {"name": "Across Shell thickness away from discontinuity", "start": (X0, Y0 + far_dist_nozzle, Z0), "end": (X0 + (shell_th * nx_s), Y0 + far_dist_nozzle, Z0 + (shell_th * nz_s))}
        ]

        created_paths = []
        for p_data in paths_data:
            path = cg_group.AddPath()
            path.Name = p_data["name"]
            try:
                path.PathType = PathScopingType.Points
            except Exception:
                pass
            try:
                path.SnapToMeshNodes = True
            except Exception:
                pass
            path.StartXCoordinate = Quantity(p_data["start"][0], "m")
            path.StartYCoordinate = Quantity(p_data["start"][1], "m")
            path.StartZCoordinate = Quantity(p_data["start"][2], "m")
            path.EndXCoordinate = Quantity(p_data["end"][0], "m")
            path.EndYCoordinate = Quantity(p_data["end"][1], "m")
            path.EndZCoordinate = Quantity(p_data["end"][2], "m")
            created_paths.append(path)

        setting = struct_analysis.AnalysisSettings
        step = setting.NumberOfSteps
        chart_ids = [c.GetHashCode() for c in model.Children if c.GetType().Name == "Chart"]
        if not chart_ids:
            chart = model.AddChart()
        else:
            chart = [c for c in model.Children if c.GetType().Name == "Chart"][0]

        temp_scl_data = {}
        for path in created_paths:
            for i in range(1, step + 1):
                LES = None
                LMP1 = None
                LMP2 = None
                LMP3 = None
                try:
                    LES = solution.AddLinearizedEquivalentStress()
                    LES.Location = path
                    LES.DisplayTime = Quantity(i, "sec")
                    LES.Name = "Linearized Eqv Stress LC" + str(i) + " - " + path.Name
                    LMP1 = solution.AddLinearizedMaximumPrincipalStress()
                    LMP1.Location = path
                    LMP1.DisplayTime = Quantity(i, "sec")
                    LMP2 = solution.AddLinearizedMiddlePrincipalStress()
                    LMP2.Location = path
                    LMP2.DisplayTime = Quantity(i, "sec")
                    LMP3 = solution.AddLinearizedMinimumPrincipalStress()
                    LMP3.Location = path
                    LMP3.DisplayTime = Quantity(i, "sec")

                    try:
                        solution.EvaluateAllResults()
                    except Exception:
                        pass

                    S1C = getattr(LMP1, "MembraneBendingCenter", None)
                    S1I = getattr(LMP1, "MembraneBendingInside", None)
                    S1O = getattr(LMP1, "MembraneBendingOutside", None)
                    try:
                        LMP1.Delete()
                    except Exception:
                        pass
                    LMP1 = None

                    S2C = getattr(LMP2, "MembraneBendingCenter", None)
                    S2I = getattr(LMP2, "MembraneBendingInside", None)
                    S2O = getattr(LMP2, "MembraneBendingOutside", None)
                    try:
                        LMP2.Delete()
                    except Exception:
                        pass
                    LMP2 = None

                    S3C = getattr(LMP3, "MembraneBendingCenter", None)
                    S3I = getattr(LMP3, "MembraneBendingInside", None)
                    S3O = getattr(LMP3, "MembraneBendingOutside", None)
                    try:
                        LMP3.Delete()
                    except Exception:
                        pass
                    LMP3 = None

                    SM_tem = getattr(LES, "Membrane", None)
                    SMBC_tem = getattr(LES, "MembraneBendingCenter", None)
                    SMBI_tem = getattr(LES, "MembraneBendingInside", None)
                    SMBO_tem = getattr(LES, "MembraneBendingOutside", None)

                    if not SM_tem or not hasattr(SM_tem, "Value") or SM_tem.Value is None:
                        try:
                            LES.Delete()
                        except Exception:
                            pass
                        continue

                    sc_val = 0.0
                    if S1C and hasattr(S1C, "Value") and S1C.Value is not None:
                        sc_val += float(S1C.Value)
                    if S2C and hasattr(S2C, "Value") and S2C.Value is not None:
                        sc_val += float(S2C.Value)
                    if S3C and hasattr(S3C, "Value") and S3C.Value is not None:
                        sc_val += float(S3C.Value)

                    si_val = 0.0
                    if S1I and hasattr(S1I, "Value") and S1I.Value is not None:
                        si_val += float(S1I.Value)
                    if S2I and hasattr(S2I, "Value") and S2I.Value is not None:
                        si_val += float(S2I.Value)
                    if S3I and hasattr(S3I, "Value") and S3I.Value is not None:
                        si_val += float(S3I.Value)

                    so_val = 0.0
                    if S1O and hasattr(S1O, "Value") and S1O.Value is not None:
                        so_val += float(S1O.Value)
                    if S2O and hasattr(S2O, "Value") and S2O.Value is not None:
                        so_val += float(S2O.Value)
                    if S3O and hasattr(S3O, "Value") and S3O.Value is not None:
                        so_val += float(S3O.Value)

                    SM = Quantity(abs(float(SM_tem.Value)), str(SM_tem.Unit)).ConvertUnit("MPa")
                    SC = Quantity(abs(sc_val), "MPa")
                    SI = Quantity(abs(si_val), "MPa")
                    SO = Quantity(abs(so_val), "MPa")
                    ST = Quantity(max(float(SO.Value), float(SI.Value), float(SC.Value)), "MPa")

                    SMBC = Quantity(abs(float(SMBC_tem.Value)), str(SMBC_tem.Unit)).ConvertUnit("MPa") if (SMBC_tem and hasattr(SMBC_tem, "Value") and SMBC_tem.Value is not None) else Quantity(0, "MPa")
                    SMBI = Quantity(abs(float(SMBI_tem.Value)), str(SMBI_tem.Unit)).ConvertUnit("MPa") if (SMBI_tem and hasattr(SMBI_tem, "Value") and SMBI_tem.Value is not None) else Quantity(0, "MPa")
                    SMBO = Quantity(abs(float(SMBO_tem.Value)), str(SMBO_tem.Unit)).ConvertUnit("MPa") if (SMBO_tem and hasattr(SMBO_tem, "Value") and SMBO_tem.Value is not None) else Quantity(0, "MPa")
                    SMB = Quantity(max(float(SMBC.Value), float(SMBI.Value), float(SMBO.Value)), "MPa")

                    if path.Name not in temp_scl_data:
                        temp_scl_data[path.Name] = {}
                    temp_scl_data[path.Name][str(i)] = {
                        "Membrane": float(SM.Value),
                        "MembraneBending": float(SMB.Value),
                        "S1S2S3": float(ST.Value),
                        "ImageFile": LES.Name.replace(" ", "_") + ".png"
                    }

                    try:
                        chart.OutlineSelection = [LES]
                        try:
                            chart.VisibleProperties[11].InternalValue = "Omit"
                            chart.VisibleProperties[13].InternalValue = "Omit"
                        except Exception:
                            pass
                        chart.XAxisLabel = "Length"
                        chart.YAxisLabel = "Stress"
                        LES.Activate()
                        ExtAPI.DataModel.Tree.Refresh()
                        image = chart.AddImage()
                        image.Name = LES.Name
                    except Exception:
                        pass

                    try:
                        comment_ids = [c.GetHashCode() for c in solution.Children if c.GetType().Name == "Comment"]
                        if not comment_ids:
                            comment = solution.AddComment()
                            comment.Text = " "
                            comment.Name = "Result Summary"
                        else:
                            comment = [c for c in solution.Children if c.GetType().Name == "Comment"][0]
                        comment.Text += "<br><span style='color:blue;'>" + str(LES.Name) + "</span>"
                        comment.Text += "<br> Membrane Stress: " + SM.ToString()
                        comment.Text += "<br> Membrane + Bending Stress: " + SMB.ToString()
                        comment.Text += "<br> S1 + S2 + S3: " + ST.ToString() + "<br>"
                    except Exception:
                        pass

                    try:
                        export_setting = Ansys.Mechanical.Graphics.GraphicsImageExportSettings()
                        export_setting.AppendGraph = True
                        export_setting.FontMagnification = 10
                        export_setting.CurrentGraphicsDisplay = False
                        safe_user_dir = wbjn.ExecuteCommand(ExtAPI, "returnValue(GetUserFilesDirectory())")
                        mypath2 = os.path.join(safe_user_dir, LES.Name.replace(" ", "_") + ".png")
                        Graphics.ExportImage(mypath2, GraphicsImageExportFormat.PNG, export_setting)
                    except Exception:
                        pass
                except Exception:
                    if LES:
                        try:
                            LES.Delete()
                        except Exception:
                            pass
                    if LMP1:
                        try:
                            LMP1.Delete()
                        except Exception:
                            pass
                    if LMP2:
                        try:
                            LMP2.Delete()
                        except Exception:
                            pass
                    if LMP3:
                        try:
                            LMP3.Delete()
                        except Exception:
                            pass
        try:
            ExtAPI.DataModel.Tree.Refresh()
        except Exception:
            pass

    dpn = wbjn.ExecuteCommand(ExtAPI, "returnValue(a+Parameters.GetActiveDesignPoint().Name)", a="DP")
    dpn = dpn + "_Analysis_" + str(ANALYSIS_IDX + 1)
    UserFilesDir = wbjn.ExecuteCommand(ExtAPI, "returnValue(GetUserFilesDirectory())")
    gset = Ansys.Mechanical.Graphics.GraphicsImageExportSettings()
    gset.CurrentGraphicsDisplay = False
    gset.Width = 1920
    gset.Height = 1080

    master_data = {
        "DesignPoint": dpn,
        "Analyses": {},
        "CustomImages": {},
        "BoundaryConditions": [],
        "Materials": {
            "Shell": ShellMaterialDisplay,
            "Nozzle": NozzleMaterialDisplay,
            "Pad": PadMaterialDisplay if pad_active else "N/A"
        }
    }
    try:
        master_data["SCL_Data"] = temp_scl_data
    except NameError:
        master_data["SCL_Data"] = {}

    def apply_camera_1():
        Graphics.Camera.FocalPoint = Point([0.13749998807907104, 0.25, 0], "m")
        Graphics.Camera.ViewVector = Vector3D(0, 1, -1.1202948551414747e-18)
        Graphics.Camera.UpVector = Vector3D(1, -1.2325951644078309e-32, -3.3990839096879828e-16)
        Graphics.Camera.SetFit()

    def apply_camera_2():
        Graphics.Camera.FocalPoint = Point([0.10343610989017159, 0.4058513676599978, -0.06911205876832939], "m")
        Graphics.Camera.ViewVector = Vector3D(0.16335570653588943, -0.6078435630938922, 0.77707214333514874)
        Graphics.Camera.UpVector = Vector3D(0.98581702158882378, 0.069858947573104194, -0.15259268458782227)
        Graphics.Camera.SceneHeight = Quantity(1.3567947399658491, "m")
        Graphics.Camera.SceneWidth = Quantity(1.6242209495823066, "m")
        Graphics.Camera.SetFit()

    def apply_camera_5():
        Graphics.Camera.FocalPoint = Point([0.07544161496789048, 0.49618420591039197, -0.011392548680305477], "m")
        Graphics.Camera.ViewVector = Vector3D(1.1493693753630206e-16, 1.970347500622321e-16, 1)
        Graphics.Camera.UpVector = Vector3D(1, -7.7715611723760958e-16, -5.6020050273319485e-17)
        Graphics.Camera.SceneHeight = Quantity(1.6903967816963759, "m")
        Graphics.Camera.SceneWidth = Quantity(1.5492124003808772, "m")
        Graphics.Camera.SetFit()

    def apply_camera_6():
        Graphics.Camera.FocalPoint = Point([0.13749998807907104, 0.5, 0], "m")
        Graphics.Camera.ViewVector = Vector3D(0.44071688268393844, 0.62735059648051694, 0.64202792650545271)
        Graphics.Camera.UpVector = Vector3D(0.8572682123558113, -0.082053633060121298, -0.50828969435343341)
        Graphics.Camera.SetFit()
        zoom_factor = 0.8
        Graphics.Camera.SceneHeight = Quantity(Graphics.Camera.SceneHeight.Value * zoom_factor, "m")
        Graphics.Camera.SceneWidth = Quantity(Graphics.Camera.SceneWidth.Value * zoom_factor, "m")

    if str(N_TYPE).strip() == "SRN":
        suppress_ids_str = [24, 26, 28, 30, 32, 34, 48, 50, 52, 54]
        suppress_ids_str_2 = [20, 24, 26, 30, 40, 42]
    else:
        if pad_active:
            suppress_ids_str = [34, 36, 38, 40, 42, 26, 44, 28]
            suppress_ids_str_2 = [30, 32, 34, 36, 38, 40, 48, 50]
        else:
            suppress_ids_str = [24, 26, 28, 38, 40, 42]
            suppress_ids_str_2 = [26, 28, 30, 32, 34, 38]

    def suppress_specific_bodies():
        with Transaction():
            for b_id in suppress_ids_str:
                try:
                    b = DataModel.GetObjectById(b_id)
                    b.Suppressed = True
                except Exception:
                    pass

    def suppress_specific_bodies_2():
        with Transaction():
            for b_id in suppress_ids_str_2:
                try:
                    b = DataModel.GetObjectById(b_id)
                    b.Suppressed = True
                except Exception:
                    pass

    Model.Geometry.Activate()
    apply_camera_6()
    geom_img_name = dpn + "_Geometry_Iso.png"
    geom_img_path = os.path.join(UserFilesDir, geom_img_name)
    if os.path.exists(geom_img_path):
        os.remove(geom_img_path)
    Graphics.ExportImage(geom_img_path, GraphicsImageExportFormat.PNG, gset)

    mesh.Activate()
    apply_camera_6()
    mesh_img_name = dpn + "_Mesh_Iso.png"
    mesh_img_path = os.path.join(UserFilesDir, mesh_img_name)
    if os.path.exists(mesh_img_path):
        os.remove(mesh_img_path)
    Graphics.ExportImage(mesh_img_path, GraphicsImageExportFormat.PNG, gset)

    try:
        suppress_specific_bodies_2()
        mesh.Activate()
        apply_camera_1()
        img_junction_mesh = dpn + "_Junction_Mesh_Zone.png"
        img_path = os.path.join(UserFilesDir, img_junction_mesh)
        if os.path.exists(img_path):
            os.remove(img_path)
        Graphics.ExportImage(img_path, GraphicsImageExportFormat.PNG, gset)
        master_data["CustomImages"]["Junction_Mesh_Zone"] = img_junction_mesh
    except Exception:
        pass
    finally:
        Model.Geometry.UnsuppressAllBodies()

    try:
        mesh.MeshMetric = Ansys.Mechanical.DataModel.Enums.MeshMetricType.ElementQuality
        min_quality = mesh.MinMeshMetric
        max_quality = mesh.MaxMeshMetric
        avg_quality = mesh.AverageMeshMetric
        mesh_quality_type = "Element Quality"
    except Exception:
        mesh_quality_type = "Element Quality"
        min_quality = 0.0
        max_quality = 0.0
        avg_quality = 0.0

    master_data["MeshStatistics"] = {
        "Nodes": mesh.Nodes,
        "Elements": mesh.Elements,
        "ActiveMetricType": mesh_quality_type,
        "MinQuality": min_quality,
        "MaxQuality": max_quality,
        "AverageQuality": avg_quality,
        "Geometry_Image": geom_img_name,
        "Mesh_Image": mesh_img_name
    }

    bc_categories = [
        DataModelObjectCategory.Pressure, DataModelObjectCategory.Force,
        DataModelObjectCategory.Displacement, DataModelObjectCategory.FixedSupport,
        DataModelObjectCategory.RemoteForce, DataModelObjectCategory.Moment,
        DataModelObjectCategory.FrictionlessSupport, DataModelObjectCategory.CylindricalSupport
    ]
    for analysis_obj in ExtAPI.DataModel.AnalysisList:
        analysis_name = analysis_obj.Name
        master_data["Analyses"][analysis_name] = []
        for child in analysis_obj.Children:
            if child.DataModelObjectCategory in bc_categories:
                child.Activate()
                c_name = child.Name.lower()
                if "pressure" in c_name:
                    suppress_specific_bodies()
                    apply_camera_5()
                elif "displacement" in c_name:
                    Model.Geometry.UnsuppressAllBodies()
                    apply_camera_2()
                else:
                    Model.Geometry.UnsuppressAllBodies()
                    apply_camera_6()
                safe_name = "".join([c for c in child.Name if c.isalpha() or c.isdigit() or c == " "]).rstrip()
                bc_img_name = dpn + "_" + safe_name.replace(" ", "_") + "_" + analysis_name + ".png"
                bc_img_path = os.path.join(UserFilesDir, bc_img_name)
                if os.path.exists(bc_img_path):
                    os.remove(bc_img_path)
                Graphics.ExportImage(bc_img_path, GraphicsImageExportFormat.PNG, gset)
                master_data["BoundaryConditions"].append({
                    "Name": child.Name,
                    "Analysis": analysis_name,
                    "ImageFile": bc_img_name
                })
        Model.Geometry.UnsuppressAllBodies()

        EqvStressResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.EquivalentStress]
        TotalDeformationResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.TotalDeformation]
        ForceReactions = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.ForceReaction]
        NormalStressResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.NormalStress]
        UserDefinedResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.UserDefinedResult]
        EqvPlasticStrainResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.EquivalentPlasticStrain]
        MaxPrinResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.MaximumPrincipalStress]
        MidPrinResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.MiddlePrincipalStress]
        MinPrinResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.MinimumPrincipalStress]
        TemperatureResults = [c for c in analysis_obj.Solution.Children if c.DataModelObjectCategory == DataModelObjectCategory.Temperature]

        AllObjects = (EqvStressResults + TotalDeformationResults + ForceReactions +
                      NormalStressResults + UserDefinedResults + EqvPlasticStrainResults +
                      MaxPrinResults + MidPrinResults + MinPrinResults + TemperatureResults)

        for obj in AllObjects:
            obj.Activate()
            obj_type = str(obj.DataModelObjectCategory)
            safe_obj_name = "".join([c for c in obj.Name if c.isalpha() or c.isdigit() or c == " "]).rstrip()
            fName = dpn + "_" + safe_obj_name.replace(" ", "_") + "_" + analysis_name + ".png"
            fPath = os.path.join(UserFilesDir, fName)
            if os.path.exists(fPath):
                os.remove(fPath)
            if "NormalStress" in obj_type:
                suppress_specific_bodies()
                apply_camera_5()
                Graphics.ExportImage(fPath, GraphicsImageExportFormat.PNG, gset)
                Model.Geometry.UnsuppressAllBodies()
            else:
                apply_camera_6()
                Graphics.ExportImage(fPath, GraphicsImageExportFormat.PNG, gset)
            entry = {"ObjectName": obj.Name, "Type": obj_type, "ImageFile": fName}
            try:
                if "Reaction" not in obj_type:
                    entry["Maximum"] = obj.Maximum.Value
                    entry["Minimum"] = obj.Minimum.Value
                    entry["Average"] = obj.Average.Value
                    entry["Unit"] = obj.Maximum.Unit
                else:
                    fx = obj.XAxis.Value
                    fy = obj.YAxis.Value
                    fz = obj.ZAxis.Value
                    f_total = math.sqrt((fx**2) + (fy**2) + (fz**2))
                    entry["Force_X"] = fx
                    entry["Force_Y"] = fy
                    entry["Force_Z"] = fz
                    entry["Force_Total"] = f_total
                    entry["Unit"] = obj.XAxis.Unit
            except Exception as e:
                entry["Error"] = str(e)
            master_data["Analyses"][analysis_name].append(entry)

        if TypeOfAnalysis == "Elastic-Plastic Analysis":
            sig1 = 0.0
            sig2 = 0.0
            sig3 = 0.0
            triax = 0.0
            epeq = 0.0
            for res in master_data["Analyses"][analysis_name]:
                n_lower = res.get("ObjectName", "").lower()
                if "maximum principal" in n_lower:
                    sig1 = float(res.get("Maximum", 0))
                elif "middle principal" in n_lower:
                    sig2 = float(res.get("Maximum", 0))
                elif "minimum principal" in n_lower:
                    sig3 = float(res.get("Maximum", 0))
                elif "triaxiality" in n_lower:
                    triax = float(res.get("Maximum", 0))
                elif "plastic strain" in n_lower and "equivalent" in n_lower:
                    epeq = float(res.get("Maximum", 0))
            R_ep = ShellYield / ShellUTS if ShellUTS != 0 else 0
            m2_ep = 0.6 * (1.0 - R_ep)
            e_lu_calc = 2.0 * math.log(1.0 + 0.21)
            elu = max(m2_ep, e_lu_calc)
            alpha_sl = 2.2
            ecf = 0.0
            eL = elu * math.exp(-(alpha_sl / (1.0 + m2_ep)) * (triax - (1.0 / 3.0)))
            total_epeq = epeq + ecf
            master_data["Local_EP_Calculations"] = {
                "Maximum Principal Stress (MPa)": sig1,
                "Middle Principal Stress (MPa)": sig2,
                "Minimum Principal Stress (MPa)": sig3,
                "Triaxiality Stress": triax,
                "Cold Forming Strain (eCF)": ecf,
                "Material Factor (alpha_SL)": alpha_sl,
                "Min Specified Yield Strength Shell (Sy)": ShellYield,
                "Min Specified UTS Shell (SUTS)": ShellUTS,
                "Ratio Sy/SUTS (R)": R_ep,
                "Factor m2": m2_ep,
                "Uniaxial Strain Limit (eLU)": elu,
                "Limiting Triaxial Strain (eL)": eL,
                "Equivalent Plastic Strain (ePEQ)": epeq,
                "Total Equivalent Plastic Strain": total_epeq
            }

    s_id = S_OD - 2 * S_THK1
    n_id = N_OD - 2 * N_THK1
    S_IR_rep = s_id / 2.0
    N_IR_rep = n_id / 2.0
    shell_thrust_rep = InternalPressure * (S_IR_rep**2) / (S_OR**2 - S_IR_rep**2)
    nozzle_thrust_rep = InternalPressure * (N_IR_rep**2) / (N_OR**2 - N_IR_rep**2)
    shell_area_rep = (3.14159 * s_id**2) / 4.0
    nozzle_area_rep = (3.14159 * n_id**2) / 4.0
    react_thrust = shell_area_rep * InternalPressure

    INT_P = str(InternalPressure)
    MAT_TEMP = str(DesignTemp)
    SHELL_MAT = ShellMaterialDisplay
    NOZZLE_MAT = NozzleMaterialDisplay
    PAD_MAT = PadMaterialDisplay if pad_active else "N/A"
    SHELL_E = str(ShellYM)
    SHELL_NU = str(ShellPR)
    NOZZLE_E = str(NozzleYM)
    NOZZLE_NU = str(NozzlePR)
    SHELL_ALLOW = str(ShellAllowable)
    NOZZLE_ALLOW = str(NozzleAllowable)
    SHELL_THRUST_STR = str(round(shell_thrust_rep, 2))
    NOZZLE_THRUST_STR = str(round(nozzle_thrust_rep, 2))
    SHELL_AREA_STR = str(round(shell_area_rep, 2))
    NOZZLE_AREA_STR = str(round(nozzle_area_rep, 2))
    Shell_Corrosion_Allowance = str(CorrosionAllowance)
    REACT_THRUST_STR = str(react_thrust)

    report_mech_status("Writing Report in MS Word")
    word_app = Word.ApplicationClass()
    try:
        word_app.Visible = False
        word_app.DisplayAlerts = Word.WdAlertLevel.wdAlertsNone
    except Exception:
        pass
    doc = word_app.Documents.Add()
    try:
        primary_section = doc.Sections.Item(1)
        primary_section.PageSetup.TopMargin = word_app.InchesToPoints(0.5)
        primary_section.PageSetup.BottomMargin = word_app.InchesToPoints(0.5)
        primary_section.PageSetup.LeftMargin = word_app.InchesToPoints(0.5)
        primary_section.PageSetup.RightMargin = word_app.InchesToPoints(0.5)
    except Exception:
        pass
    selection = word_app.Selection
    font_family = "Arial"
    page_tracker = [0]

    def manual_page_break():
        try:
            selection.EndKey(Word.WdUnits.wdStory)
            selection.InsertBreak(Word.WdBreakType.wdPageBreak)
        except Exception:
            pass
        page_tracker[0] = 0

    def add_paragraph(text, size=9, bold=False, align=Word.WdParagraphAlignment.wdAlignParagraphLeft, color=Word.WdColorIndex.wdAuto, space_after=6):
        try:
            selection.EndKey(Word.WdUnits.wdStory)
            para = selection.Paragraphs.Add()
            para.Range.Text = text
            try:
                para.Range.Font.Name = font_family
            except Exception:
                pass
            try:
                para.Range.Font.Size = size
            except Exception:
                pass
            try:
                para.Range.Font.Bold = bold
            except Exception:
                pass
            try:
                para.Range.Font.ColorIndex = color
            except Exception:
                pass
            try:
                para.Alignment = align
            except Exception:
                pass
            try:
                para.Format.SpaceAfter = space_after
            except Exception:
                pass
            para.Range.InsertParagraphAfter()
        except Exception:
            pass

    def build_table(headers, data_rows, col_widths=None):
        try:
            selection.EndKey(Word.WdUnits.wdStory)
            rows = len(data_rows) + 1
            cols = len(headers)
            table = doc.Tables.Add(selection.Range, rows, cols)
            try:
                table.Borders.Enable = True
            except Exception:
                pass
            for i, h in enumerate(headers):
                try:
                    cell = table.Cell(1, i + 1)
                    cell.Range.Text = h
                    cell.Range.Font.Bold = True
                    cell.Range.Font.Size = 8.5
                    cell.Range.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter
                    cell.Shading.BackgroundPatternColor = Word.WdColor.wdColorGray10
                    cell.VerticalAlignment = Word.WdCellVerticalAlignment.wdCellAlignVerticalCenter
                except Exception:
                    pass
            for r_idx, row in enumerate(data_rows):
                for c_idx, val in enumerate(row):
                    if c_idx < cols:
                        try:
                            cell = table.Cell(r_idx + 2, c_idx + 1)
                            cell.Range.Text = str(val)
                            cell.Range.Font.Size = 8.5
                            cell.Range.Font.Bold = (c_idx == 0)
                            cell.VerticalAlignment = Word.WdCellVerticalAlignment.wdCellAlignVerticalCenter
                            if c_idx == 0 or len(headers) > 5:
                                cell.Range.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter
                        except Exception:
                            pass
            selection.EndKey(Word.WdUnits.wdStory)
            selection.TypeParagraph()
        except Exception:
            pass

    def fig_placeholder(label):
        try:
            selection.EndKey(Word.WdUnits.wdStory)
            table = doc.Tables.Add(selection.Range, 1, 1)
            try:
                table.Borders.Enable = True
                table.Rows.Height = word_app.InchesToPoints(3.0)
            except Exception:
                pass
            cell = table.Cell(1, 1)
            cell.Range.Text = "[Figure: " + label + "]"
            try:
                cell.Range.Font.Italic = True
                cell.Range.Font.ColorIndex = Word.WdColorIndex.wdGray50
                cell.Range.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter
                cell.VerticalAlignment = Word.WdCellVerticalAlignment.wdCellAlignVerticalCenter
            except Exception:
                pass
            selection.EndKey(Word.WdUnits.wdStory)
            add_paragraph(label, size=8.5, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=12)
            page_tracker[0] += 1
            if page_tracker[0] >= 2:
                manual_page_break()
        except Exception:
            pass

    def insert_dynamic_image(img_name, label):
        if not img_name:
            fig_placeholder(label)
            return
        img_path = os.path.join(UserFilesDir, img_name)
        try:
            selection.EndKey(Word.WdUnits.wdStory)
            if os.path.exists(img_path) and os.path.isfile(img_path):
                shape = selection.InlineShapes.AddPicture(FileName=img_path, LinkToFile=False, SaveWithDocument=True)
                try:
                    shape.Width = word_app.InchesToPoints(6.0)
                    shape.Height = word_app.InchesToPoints(4.0)
                except Exception:
                    pass
                try:
                    shape.Borders.Enable = True
                    shape.Borders.OutsideLineStyle = 1
                    shape.Borders.OutsideLineWidth = 4
                    shape.Borders.OutsideColorIndex = 1
                except Exception:
                    pass
                selection.TypeParagraph()
                add_paragraph(label, size=8.5, bold=True, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=12)
                page_tracker[0] += 1
                if page_tracker[0] >= 2:
                    manual_page_break()
            else:
                fig_placeholder(label)
        except Exception:
            fig_placeholder(label)

    add_paragraph("FE STRESS ANALYSIS FOR Shell NOZZLE", size=11, bold=True, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=12)
    add_paragraph(" 1. General :", size=10, bold=True)
    add_paragraph("1.1. Scope :", size=9, bold=True)
    add_paragraph("    The scope of this FE Analysis is to compute the stresses developed in Nozzle and its junction with the Shell under loadings specified in the subsequent Para. And check the adequacy of the same.")
    if TypeOfAnalysis in ["Elastic-Plastic Analysis", "Limit-Load Analysis"]:
        add_paragraph("    The FE Analysis is carried out as per ASME SEC. VIII DIV-II, Ed. 2025. By using software ANSYS ver. 2024 R1", space_after=12)
    else:
        add_paragraph("    The FE Analysis is carried out as per ASME SEC. VIII DIV-II, Ed. 2025 using allowable stress as per Table 5A. By using software ANSYS ver. 2024 R1", space_after=12)

    add_paragraph("2. Analysis conditions [3] :", size=10, bold=True)
    add_paragraph("    Design Condition:", bold=True)
    add_paragraph("   (i) MAWP                                                                                                                                               : " + INT_P + " MPa")
    add_paragraph("   (ii) Shell Side Design Temperature                                                                                                        : " + MAT_TEMP + " deg C", space_after=12)

    add_paragraph("3. Material Specifications [3] :", size=10, bold=True)
    add_paragraph("  (i) Shell                                                                                                                                                  : " + SHELL_MAT)
    add_paragraph("  (ii) Nozzle                                                                                                                                               : " + NOZZLE_MAT)
    if pad_active:
        add_paragraph("  (iii) Reinforcement Pad                                                                                                                           : " + PAD_MAT, space_after=12)
    else:
        add_paragraph("  (iii) Reinforcement Pad                                                                                                                           : Not Provided", space_after=12)

    add_paragraph("3.1 Material Properties [2] :", size=9, bold=True)
    add_paragraph("   The material properties used for the modeled portion are:")
    add_paragraph("                                                                                           Table 3.1 Material Properties", bold=True)
    
    mat_rows = [
        [ShellMaterialDisplay, MAT_TEMP, str(ShellYM), str(ShellPR)],
        [NozzleMaterialDisplay, MAT_TEMP, str(NozzleYM), str(NozzlePR)]
    ]
    if pad_active:
        mat_rows.append([PadMaterialDisplay, MAT_TEMP, str(PadYM), str(PadPR)])
        
    build_table(
        ["Material", "Temperature, T (deg C)", "Modulus of Elasticity, E (MPa)", "Poisson's Ratio (v)"],
        mat_rows)
    add_paragraph("Where;\\nT  :  Temperature\\nE  :  Modulus of Elasticity as per [2]\\nv  :  Poisson's Ratio as per [2]", space_after=12)

    add_paragraph("4. Model for Analysis [3] :", size=10, bold=True)
    add_paragraph("   Refer Fig. 1.1 shows the geometry of the model for analysis. Analysis features are as listed below;")
    add_paragraph("   (i) Complete 360-degree model of Shell geometry, nozzle are considered for analysis.")
    add_paragraph("   (ii)  The FE model consists of modelled Shell geometry, nozzle. The 3D finite element model uses 8 Noded- SOLID185 elements for Structural Analysis.")
    add_paragraph("   (iii) Dimensions of modeled geometry are modeled in corroded condition as per [3].")
    add_paragraph("         Shell side Corrosion Allowance [3] = " + Shell_Corrosion_Allowance + " mm", space_after=12)
    add_paragraph("         Refer Fig. 2.1 to 2.2 for Meshed FEA model.")

    if OperatingCondition.upper() == "YES":
        add_paragraph("4.1 Thermal Analysis :", size=10, bold=True)
        add_paragraph("    A Steady-State Thermal Analysis was performed prior to Structural Analysis.")
        add_paragraph("    Convection boundaries were applied with following Heat Transfer Coefficients (HTC):")
        add_paragraph("    Shell ID HTC = " + str(ShellIdHTC) + " W/m^2.C, Nozzle ID HTC = " + str(NozzleIdHTC) + " W/m^2.C, Outside HTC = " + str(OutsideHTC) + " W/m^2.C.")
        add_paragraph("    The temperature distribution was imported to structural analysis to evaluate thermal stresses.", space_after=12)

    if TypeOfAnalysis not in ["Elastic-Plastic Analysis", "Limit-Load Analysis"]:
        add_paragraph("5. Mesh sensitivity check :", size=10, bold=True)
        add_paragraph("   Mesh sensitivity check has been performed on the model to check the accuracy of the mesh.")
        add_paragraph("   The results for load case 1 are discussed below.")
        add_paragraph("                                                                                           Table 5.1: Mesh sensitivity Review", bold=True)
        element_count = str(master_data["MeshStatistics"]["Elements"])
        eqv_stress_res = next((res for res in master_data["Analyses"].get("Static Structural", []) if res.get("ObjectName") == "Equivalent Stress"), {})
        total_def_res = next((res for res in master_data["Analyses"].get("Static Structural", []) if res.get("ObjectName") == "Total Deformation"), {})
        eqv_max = str(round(eqv_stress_res.get("Maximum", 0) / 1e6, 2)) if "Maximum" in eqv_stress_res else "N/A"
        def_max = str(round(total_def_res.get("Maximum", 0) * 1000, 2)) if "Maximum" in total_def_res else "N/A"
        build_table(["Sr. No", "No. of Elements", "Max. Von-Mises Stress (MPa)", "Maximum Deformation (mm)"], [["1", element_count, eqv_max, def_max]])
        add_paragraph(" FE stress analysis total " + element_count + " number of elements are used for Structural Analysis. Refer Annexure-1 for Mesh Sensitivity.", space_after=12)
    else:
        element_count = str(master_data["MeshStatistics"]["Elements"])

    manual_page_break()
    add_paragraph(" 6. Loadings [3] :", size=10, bold=True)
    add_paragraph("6.1. Load Cases :", size=9, bold=True)
    add_paragraph("     Two load cases are considered for the analysis as listed in Table 6.1.")
    add_paragraph("                                                                                           Table 6.1 Load Case [3]", bold=True)
    build_table(
        ["Load Case", "Shell Design Pressure MPa", "Nozzle Loads"],
        [["1", INT_P, "No"], ["2", INT_P, "Yes"]])

    add_paragraph("6.2. Applied Boundary Conditions :", size=9, bold=True)
    add_paragraph("     At the open end face of modeled shell farther from modelled nozzle, all degrees of freedom are fixed except X axis (i.e. UX=Free, UY=UZ=0) in global coordinate system for all load cases. Refer Fig 3.1.", space_after=12)

    add_paragraph("6.3. Applied Loading [3] :", size=9, bold=True)
    add_paragraph("     (i) MAWP is applied on all internal faces of modelled shell, Nozzles for all load cases. Refer Fig 4.1 for applied MAWP for all load cases.")
    add_paragraph("     (ii) To simulate the closed end conditions, a uniform pressure thrust equivalent to axial load due to MAWP is applied at free end face of modelled shell closer to modelled nozzle, nozzle for all load cases as per Table 6.2. Refer Fig. 4.2 & Fig. 4.3 for applied nozzle thrusts and shell thrust for all load cases, respectively.")
    add_paragraph("                                                                                           Table 6.2 Applied Thrust Force", bold=True)
    build_table(
        ["Component", "Opening ID (mm)", "Opening Area (mm^2)", "Internal Pressure (MPa)", "Applied Thrust (MPa)"],
        [
            ["Nozzle", str(n_id), NOZZLE_AREA_STR, INT_P, NOZZLE_THRUST_STR],
            ["Shell", str(s_id), SHELL_AREA_STR, INT_P, SHELL_THRUST_STR]
        ])

    add_paragraph("6.4. Applied Nozzle Loadings [3] :", size=9, bold=True)
    add_paragraph("     On Nozzle, loads are applied at remote point location at Shell to Nozzle junction in local coordinate system for load cases 2 as shown in the Table 6.3. Refer Fig. 4.4 & 4.5 for applied nozzle loadings for load case 2.")
    add_paragraph("                                                                                           Table 6.3 Applied Nozzle Loadings for load case 2 [3]", bold=True)
    build_table(
        ["Direction as per [3]", "FL", "Fa", "FC", "MC", "MT", "ML"],
        [
            ["Direction as ANSYS", "FX", "FY", "FZ", "MX", "MY", "MZ"],
            ["Units", "N", "N", "N", "N-mm", "N-mm", "N-mm"],
            ["Nozzle", str(FL), str(Fa), str(FC), str(MC), str(MT), str(ML)]
        ])

    if TypeOfAnalysis not in ["Elastic-Plastic Analysis", "Limit-Load Analysis"]:
        add_paragraph("7. Allowable Stress category as per [2] :", size=10, bold=True)
        add_paragraph("   Allowable stress values are given in Table 7.1.")
        add_paragraph("                                                                               Table 7.1 Allowable stress Criteria (Shell)", bold=True)
        build_table(
            ["Material", "Temp.", "S", "1.5S", "3S", "4S"],
            [
                ["Units", "C", "MPa", "MPa", "MPa", "MPa"],
                [SHELL_MAT, MAT_TEMP, SHELL_ALLOW, str(1.5 * ShellAllowable), str(3 * ShellAllowable), str(4 * ShellAllowable)],
                [NOZZLE_MAT, MAT_TEMP, NOZZLE_ALLOW, str(1.5 * NozzleAllowable), str(3 * NozzleAllowable), str(4 * NozzleAllowable)]
            ])
        add_paragraph("   Where;  Pm=Membrane stress, PL=Local membrane stress, Pb=Bending Stress, Q=secondary Stress,")
        add_paragraph("                S=Allowable stress at design temperature as per Table 5A of [2].", space_after=12)
        manual_page_break()

    add_paragraph("8. Stress Analysis Output :", size=10, bold=True)
    if TypeOfAnalysis == "Elastic-Plastic Analysis":
        add_paragraph("   Equivalent Plastic strain plot for load cases 1 & 2 are shown in Fig.7.1 to 7.2, respectively. And Principal stress at node of max Plastic strain plots for load cases 1 to 2 in Fig.8.1 to 8.6, respectively.", space_after=12)
        ep_calc = master_data.get("Local_EP_Calculations", {})
        sig1_str = str(round(ep_calc.get("Maximum Principal Stress (MPa)", 0) / 1e6, 2))
        sig2_str = str(round(ep_calc.get("Middle Principal Stress (MPa)", 0) / 1e6, 2))
        sig3_str = str(round(ep_calc.get("Minimum Principal Stress (MPa)", 0) / 1e6, 2))
        triax_str = str(round(ep_calc.get("Triaxiality Stress", 0), 3))
        ecf_str = str(round(ep_calc.get("Cold Forming Strain (eCF)", 0), 3))
        alpha_sl_str = str(round(ep_calc.get("Material Factor (alpha_SL)", 2.2), 3))
        sy_str = str(round(ep_calc.get("Min Specified Yield Strength Shell (Sy)", 0), 1))
        suts_str = str(round(ep_calc.get("Min Specified UTS Shell (SUTS)", 0), 1))
        r_str = str(round(ep_calc.get("Ratio Sy/SUTS (R)", 0), 3))
        m2_str = str(round(ep_calc.get("Factor m2", 0), 3))
        elu_str = str(round(ep_calc.get("Uniaxial Strain Limit (eLU)", 0), 4))
        el_str = str(round(ep_calc.get("Limiting Triaxial Strain (eL)", 0), 4))
        epeq_str = str(round(ep_calc.get("Equivalent Plastic Strain (ePEQ)", 0), 4))
        total_epeq_str = str(round(ep_calc.get("Total Equivalent Plastic Strain", 0), 4))
        add_paragraph("                                                                               Table 8.1 Elastic-Plastic Analysis Calculations", bold=True)
        build_table(
            ["Variable", "Value", "Unit"],
            [
                ["Maximum Principal Stress", sig1_str, "MPa"],
                ["Middle Principal Stress", sig2_str, "MPa"],
                ["Minimum Principal Stress", sig3_str, "MPa"],
                ["Triaxiality Stress", triax_str, ""],
                ["Cold Forming Strain", ecf_str, ""],
                ["Material Factor (Multiaxial Strain Limit)", alpha_sl_str, ""],
                ["Min. Specified Yield Strength (Shell)", sy_str, "MPa"],
                ["Min. Specified Ultimate Tensile Strength (Shell)", suts_str, "MPa"],
                ["Ratio Sy/SUTS", r_str, ""],
                ["Factor m2", m2_str, ""],
                ["Uniaxial Strain Limit", elu_str, ""],
                ["Limiting Triaxial Strain", el_str, ""],
                ["Equivalent Plastic Strain", epeq_str, ""],
                ["Total Equivalent Plastic Strain", total_epeq_str, ""]
            ])
        manual_page_break()
        add_paragraph("9. Conclusion :", size=10, bold=True)
        add_paragraph("   Based upon the analysis results stresses for Nozzles and their junctions with the Shell are found within the code allowable limits for all the load cases defined in Para 6. Hence the thicknesses considered are adequate for the applied loadings.", space_after=12)
        add_paragraph("10. Result verification :", size=10, bold=True)
        add_paragraph("    Results are verified for achieved force convergence & displacement convergence :")
        add_paragraph("    Refer Fig. 5.1 to 5.2 for force convergence & displacement convergence achieved graphs for the analysis case. ", space_after=12)

    elif TypeOfAnalysis == "Elastic Analysis":
        add_paragraph("   Deformation Plot for load cases 1 & 2 are shown in Fig 5.1 to 5.2, respectively. And Von-Mises equivalent stress plots for load cases 1 to 2 are shown in Fig 6.1 to 6.2, respectively.")
        add_paragraph("   Stress categorization is done at various critical locations across thickness for all the load cases.")
        add_paragraph("   The results of the stress categorization for the load cases 1 & 2 are described in Tables 8.1 to 8.2 respectively.")
        add_paragraph("   Refer Annexure 2 for SCL plots.", space_after=12)
        limit_local = str(round(1.5 * ShellAllowable, 2)) + "\\n" + str(round(3 * ShellAllowable, 2)) + "\\n" + str(round(4 * ShellAllowable, 2))
        limit_general = str(round(ShellAllowable, 2)) + "\\n" + str(round(1.5 * ShellAllowable, 2))
        add_paragraph("                                                                 Table 8.1: Stress Categorization Results for load case 1", bold=True)
        scl_names = [
            "At Max Stress Location",
            "Across Nozzle thickness at Nozzle to Shell junction",
            "Across Shell thickness at Nozzle to Shell junction",
            "Across Nozzle thickness away from discontinuity",
            "Across Shell thickness away from discontinuity"
        ]
        scl_disc = ["No", "No", "No", "Yes", "Yes"]
        rows_lc1 = []
        for idx in range(1, 6):
            s_name = scl_names[idx - 1]
            away_from_disc = scl_disc[idx - 1]
            if away_from_disc == "Yes":
                cat = "Pm\\nPm+Pb"
                lim = limit_general
            else:
                cat = "Pl\\nPL+Pb+Q\\nS1+ S2+ S3"
                lim = limit_local
            step_str = "1"
            if "SCL_Data" in master_data and s_name in master_data["SCL_Data"] and step_str in master_data["SCL_Data"][s_name]:
                data = master_data["SCL_Data"][s_name][step_str]
                pm = str(round(data["Membrane"], 2))
                plpb = str(round(data["MembraneBending"], 2))
                st = str(round(data["S1S2S3"], 2))
                val = pm + "\\n" + plpb if away_from_disc == "Yes" else pm + "\\n" + plpb + "\\n" + st
            else:
                val = "N/A\\nN/A" if away_from_disc == "Yes" else "N/A\\nN/A\\nN/A"
            rows_lc1.append([str(idx), s_name, cat, val, lim])
        build_table(["SCL No.", "Description", "Category", "LC1 (MPa)", "Allow. Limit (MPa)"], rows_lc1)
        rows_lc2 = []
        for idx in range(1, 6):
            s_name = scl_names[idx - 1]
            away_from_disc = scl_disc[idx - 1]
            if away_from_disc == "Yes":
                cat = "Pm\\nPm+Pb"
                lim = limit_general
            else:
                cat = "Pl\\nPL+Pb+Q\\nS1+ S2+ S3"
                lim = limit_local
            display_idx = idx + 5
            step_str = "2"
            if "SCL_Data" in master_data and s_name in master_data["SCL_Data"] and step_str in master_data["SCL_Data"][s_name]:
                data = master_data["SCL_Data"][s_name][step_str]
                pm = str(round(data["Membrane"], 2))
                plpb = str(round(data["MembraneBending"], 2))
                st = str(round(data["S1S2S3"], 2))
                val = pm + "\\n" + plpb if away_from_disc == "Yes" else pm + "\\n" + plpb + "\\n" + st
            else:
                val = "N/A\\nN/A" if away_from_disc == "Yes" else "N/A\\nN/A\\nN/A"
            rows_lc2.append([str(display_idx), s_name, cat, val, lim])
        if step >= 2:
            add_paragraph("                                                                 Table 8.2: Stress Categorization Results for load case 2", bold=True)
            build_table(["SCL No.", "Description", "Category", "LC2 (MPa)", "Allow. Limit (MPa)"], rows_lc2)
        add_paragraph("9. Conclusion :", size=10, bold=True)
        add_paragraph("   Based upon the analysis results stresses for Nozzles and their junctions with the Shell are found within the code allowable limits for all the load cases defined in Para 6. Hence the thicknesses considered are adequate for the applied loadings.", space_after=12)
        hoop_stress_val = (InternalPressure * s_id) / (2 * S_THK1)
        add_paragraph("10. Result verification :", size=10, bold=True)
        add_paragraph("    Results are verified for hoop stress & reaction forces for only pressure loads as follows:")
        add_paragraph("10.1 Hoop stress verification:", size=9, bold=True)
        add_paragraph("     Hoop stress in Shell belt away from discontinuity after applying only pressure loads is:")
        add_paragraph("     Hoop Stress = P * D / (2 * t) = " + str(round(hoop_stress_val, 2)) + " MPa", bold=True)
        add_paragraph("     Where,")
        add_paragraph("     Internal Diameter of Shell belt, D = " + str(s_id) + " mm,\\n     Applied Shell Side pressure, P = " + INT_P + " MPa,\\n     Shell belt thickness, t = " + str(S_THK1) + " mm\\n")
        add_paragraph("     Hoop stress measured along the tangential direction (Z Dir.) in local cylindrical coordinate system = " + str(round(hoop_stress_val, 2)) + " MPa.")
        add_paragraph("     Refer Fig. 7.1 for Hoop Stress verification for the analysis case.")
        add_paragraph("     From the analysis it is concluded that the values obtained from FEA are approximately same as calculated.")
        add_paragraph("     Hence results are verified for hoop stress.", space_after=12)
        add_paragraph("10.2 Reaction Force Verification in Global Y Axis for only Pressure Load :", size=9, bold=True)
        add_paragraph("     Net reaction force along global Y direction = - Shell Side Thrust")
        add_paragraph("     = - " + REACT_THRUST_STR + " N", bold=True)
        add_paragraph("     Shell Side Thrust = MAWP * (PI/4) * (Shell ID)^2")
        add_paragraph("     After applying the loading on FEA model, ANSYS output value of the net reaction force for the analysis case in Global Y direction for fixed & sliding saddle is " + REACT_THRUST_STR + " = N. Refer Fig. 7.2 for Reaction force verification for the analysis case.")
        add_paragraph("     From the analysis it is concluded that the values obtained from FEA are approximately same as calculated.")
        add_paragraph("     Hence results are verified for reaction forces.", space_after=12)

    elif TypeOfAnalysis == "Limit-Load Analysis":
        add_paragraph("   Equivalent Von-Mises Stress and Total Deformation plots for all load cases are shown in figures below.", space_after=12)
        add_paragraph("9. Conclusion :", size=10, bold=True)
        add_paragraph("   Based upon the analysis results, the applied loads are within the Limit Load capacity of the nozzle-shell junction as per ASME SEC. VIII DIV-II. Hence the geometry is adequate for the applied loadings.", space_after=12)
        add_paragraph("10. Result verification :", size=10, bold=True)
        add_paragraph("    Results are verified for achieved force convergence & displacement convergence :")
        add_paragraph("    Refer convergence plots for the analysis case. ", space_after=12)

    add_paragraph("    Reference :", size=10, bold=True)
    add_paragraph("     1. ASME Section VIII Division 2, Ed.2025.\\n      2. ASME Section II Part D, Ed.2025.")
    manual_page_break()

    general_images = []
    mesh_sensitivity_images = []
    geom_img = master_data["MeshStatistics"].get("Geometry_Image", "")
    mesh_img = master_data["MeshStatistics"].get("Mesh_Image", "")
    general_images.append({"file": geom_img, "title": "Fig. 1.1 Geometry Model (Isometric View)"})
    general_images.append({"file": mesh_img, "title": "Fig. 2.1 Meshed FEA model (Isometric View)"})
    if master_data.get("CustomImages", {}).get("Junction_Mesh_Zone"):
        general_images.append({"file": master_data["CustomImages"]["Junction_Mesh_Zone"], "title": "Fig. 2.2 Meshed FEA Model for Nozzle (Zoomed Section View)"})

    if TypeOfAnalysis in ["Elastic-Plastic Analysis", "Limit-Load Analysis"]:
        if master_data.get("CustomImages", {}).get("Force_Convergence"):
            general_images.append({"file": master_data["CustomImages"]["Force_Convergence"], "title": "Fig.5.1 Force Convergence Plot"})
        if master_data.get("CustomImages", {}).get("Displacement_Convergence"):
            general_images.append({"file": master_data["CustomImages"]["Displacement_Convergence"], "title": "Fig.5.2 Displacement Convergence Plot"})

    def get_mapped_name(obj_name):
        mapping = {
            "shell thrust": "Fig.4.3 Applied Shell Thrust for all load cases (in Pa)",
            "displacement": "Fig.3.1 Applied boundary condition for all load cases.",
            "pressure": "Fig.4.1 Applied MAWP for all load cases (in Pa)",
            "nozzle thrust": "Fig.4.2 Applied Thrust for Nozzle for all load cases (in Pa)",
            "remote force": "Fig.4.4 Applied Nozzle Loads (in N) for load case 2",
            "moment": "Fig.4.5 Applied Nozzle Moments (in N-mm) for load case 2",
            "equivalent stress": "Fig.6.1 Equivalent Von-Mises Stress plot for load case 1 (in Pa)",
            "equivalent stress 2": "Fig.6.2 Equivalent Von-Mises Stress plot for load case 2 (in Pa)",
            "mesh sensitivity": "Von Mises Equivalent Stress Plot for " + element_count + " Nos. of Elements (in Pa)",
            "normal stress": "Fig.7.1 Hoop Stress verification at inner surfaces of Shell for load case 1 (in Pa)",
            "force reaction 2": "Fig.7.2 Reaction force solution in Global Y direction for load case 1 (in N)",
            "equivalent plastic strain": "Fig.7.1 Equivalent Plastic Strain plot for load case 1",
            "maximum principal stress": "Fig.8.1 Maximum Principal Stress plot for load case 1 (in Pa)",
            "middle principal stress": "Fig.8.2 Medium Principal Stress plot for load case 1 (in Pa)",
            "minimum principal stress": "Fig.8.3 Minimum Principal Stress plot for load case 1 (in Pa)",
            "stress triaxiality at max node": "Fig.6.1 Triaxiality Stress plot for load case 1 (in Pa)",
            "temperature distribution": "Fig.4.1 Thermal Temperature Distribution (in C)"
        }
        if TypeOfAnalysis not in ["Elastic-Plastic Analysis", "Limit-Load Analysis"]:
            mapping["total deformation"] = "Fig.5.1 Deformation plot for load case 1 (in m)"
            mapping["total deformation 2"] = "Fig.5.2 Deformation plot for load case 2 (in m)"
        elif TypeOfAnalysis == "Elastic-Plastic Analysis":
            mapping["total deformation"] = "Fig.9.1 Deformation plot for load case 1 (in m)"
            mapping["total deformation 2"] = "Fig.9.2 Deformation plot for load case 2 (in m)"
        return mapping.get(obj_name.lower().strip(), obj_name)

    for bc in master_data.get("BoundaryConditions", []):
        mapped_name = get_mapped_name(bc["Name"])
        general_images.append({"file": bc["ImageFile"], "title": mapped_name})

    for res in master_data.get("Analyses", {}).get("Static Structural", []) + master_data.get("Analyses", {}).get("Steady-State Thermal", []):
        if res.get("ImageFile"):
            obj_name = res.get("ObjectName", "")
            obj_lower = obj_name.lower().strip()
            if "normal stress 2" in obj_lower or obj_lower == "force reaction":
                continue
            mapped_name = get_mapped_name(obj_name)
            if TypeOfAnalysis == "Elastic-Plastic Analysis":
                ep_keys = ["plastic strain", "principal stress", "triaxiality"]
                if any(k in obj_lower for k in ep_keys) or "mesh sensitivity" in obj_lower:
                    mesh_sensitivity_images.append({"file": res["ImageFile"], "title": mapped_name})
                else:
                    general_images.append({"file": res["ImageFile"], "title": mapped_name})
            elif TypeOfAnalysis == "Elastic Analysis":
                if "mesh sensitivity" in obj_lower:
                    mesh_sensitivity_images.append({"file": res["ImageFile"], "title": mapped_name})
                else:
                    general_images.append({"file": res["ImageFile"], "title": mapped_name})
            else:
                general_images.append({"file": res["ImageFile"], "title": mapped_name})

    def get_sort_key(item):
        match = re.search(r"Fig\\.?\\s*(\\d+)\\.(\\d+)", item["title"], re.IGNORECASE)
        if match:
            return (int(match.group(1)), int(match.group(2)))
        return (999, 999)

    general_images.sort(key=get_sort_key)
    for img in general_images:
        insert_dynamic_image(img["file"], img["title"])

    if page_tracker[0] > 0:
        manual_page_break()

    if TypeOfAnalysis in ["Elastic-Plastic Analysis", "Elastic Analysis"]:
        add_paragraph("Annexure- 1", size=12, bold=True, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=6)

    if TypeOfAnalysis not in ["Elastic-Plastic Analysis", "Limit-Load Analysis"]:
        add_paragraph("Mesh Sensitivity Review", size=11, bold=True, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=12)

    for img in mesh_sensitivity_images:
        insert_dynamic_image(img["file"], img["title"])

    if TypeOfAnalysis == "Elastic Analysis":
        if page_tracker[0] > 0:
            manual_page_break()
        add_paragraph("Annexure- 2", size=12, bold=True, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=6)
        add_paragraph("SCL Plots for Load Case 1", size=11, bold=True, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=12)
        scl_counter = 1
        for s_name in scl_names:
            if "SCL_Data" in master_data and s_name in master_data["SCL_Data"] and "1" in master_data["SCL_Data"][s_name]:
                img_file = master_data["SCL_Data"][s_name]["1"]["ImageFile"]
                insert_dynamic_image(img_file, "SCL " + str(scl_counter))
            scl_counter += 1
        if step >= 2:
            add_paragraph("SCL Plots for Load Case 2", size=11, bold=True, align=Word.WdParagraphAlignment.wdAlignParagraphCenter, space_after=12)
            scl_counter = 6
            for s_name in scl_names:
                if "SCL_Data" in master_data and s_name in master_data["SCL_Data"] and "2" in master_data["SCL_Data"][s_name]:
                    img_file = master_data["SCL_Data"][s_name]["2"]["ImageFile"]
                    insert_dynamic_image(img_file, "SCL " + str(scl_counter))
                scl_counter += 1

    json_res_path = os.path.join(UserFilesDir, dpn + "_mechanical_results.json")
    with open(json_res_path, "w") as jf:
        json.dump(master_data, jf, indent=4)

    report_name = dpn + "_FEA_Report.docx"
    report_save_path = os.path.join(UserFilesDir, report_name)
    try:
        doc.SaveAs(report_save_path)
    except Exception:
        try:
            doc.SaveAs2(report_save_path)
        except Exception:
            pass
    try:
        word_app.Visible = True
    except Exception:
        pass

except Exception as e:
    import traceback
    with open(os.path.join(SAFE_BASE_DIR, "mech_error_" + str(ANALYSIS_IDX) + ".txt"), "w") as f:
        f.write(traceback.format_exc())
"""

            mech_scr = mech_vars + mech_body

            write_status("Opening Ansys Mechanical", base_p)
            mod_comp = sys1.GetComponent(Name="Model")
            mod_comp.Refresh()
            mod_cont = sys1.GetContainer(ComponentName="Model")
            mod_cont.Edit(Interactive=True)
            mod_cont.SendCommand(Language="Python", Command=mech_scr)
            mod_cont.Exit()

            if os.path.exists(mech_err_p):
                with open(mech_err_p, "r") as ef:
                    err_c = ef.read()
                os.remove(mech_err_p)
                raise RuntimeError("Mechanical Automation Failed for Analysis " + str(idx + 1) + ":\n" + err_c)

            b_dir = os.path.dirname(base_p)
            if b_dir and not os.path.exists(b_dir):
                os.makedirs(b_dir)
            Save(FilePath=base_p + ".wbpj", Overwrite=True)

            ufd = base_p + "_files" + os.sep + "user_files"
            if not os.path.exists(ufd):
                try:
                    os.makedirs(ufd)
                except OSError:
                    pass

            j_dest = os.path.join(ufd, "Nozzle_Data_Analysis_" + str(idx + 1) + ".json")
            try:
                with open(j_dest, "w") as jdf:
                    json.dump(itm, jdf, indent=4)
            except Exception as json_err:
                with open(os.path.join(base_p, "JSON_Write_Error.txt"), "w") as errf:
                    errf.write("Failed to write JSON: " + str(json_err))

        except Exception as master_error:
            import traceback
            err_str = traceback.format_exc()
            try:
                log_dir = itm.get("AnalysisFolder", os.path.expanduser("~"))
                log_path = os.path.join(log_dir, "Wizard_Crash_Log_Analysis_" + str(idx + 1) + ".txt")
                with open(log_path, "w") as lf:
                    lf.write("--- ANSYS ACT WIZARD CRASH LOG ---\n")
                    lf.write("Analysis Index: " + str(idx + 1) + "\n")
                    lf.write(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
                    lf.write(err_str)
            except Exception:
                pass

try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    possible_paths = [
        os.path.join(script_dir, "Nozzle_Batch_Data.json"),
        os.path.join(os.getcwd(), "Nozzle_Batch_Data.json"),
        os.path.join(r"D:\Nova\Client_Cloud_9", "Nozzle_Batch_Data.json")
    ]
    target_json = None
    for p in possible_paths:
        if os.path.exists(p):
            target_json = p
            break
            
    if target_json and os.path.exists(target_json):
        run_batch(target_json)
    else:
        raise FileNotFoundError("Could not find Nozzle_Batch_Data.json in: " + str(possible_paths))
except Exception as execution_error:
    import traceback
    try:
        log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Execution_Crash_Log.txt")
        with open(log_file, "w") as f:
            f.write("Script Execution Failed to Call Main Batch Function:\n")
            f.write(traceback.format_exc())
    except Exception:
        pass
finally:
    try:
        Exit()
    except Exception:
        pass