"""
TrackEd v2 — Backend API
Flask + SQLite REST API

New in v2:
  - Roles: principal (monitor-only), teacher (admin), parent (view-only)
  - Teacher self-registration with principal approval flow
  - Teacher adds parents (parent accounts auto-created)
  - DepEd subjects per grade level
  - Per-subject, per-quarter grade storage
  - Monthly attendance format
  - Failing-grade auto-alerts (messages sent to parent automatically)
  - Ranking endpoint (per section & per grade) with honors
  - Announcements with category, pinned flag, audience filter
"""

import sqlite3, hashlib, hmac, json, time, os, base64, datetime
from functools import wraps
from flask import Flask, request, jsonify, g
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

SECRET_KEY = os.environ.get("SECRET_KEY", "tracked-v2-secret-2025")
DB_PATH    = os.path.join(os.path.dirname(__file__), "tracked_v2.db")

# ─── DepEd subjects by grade ────────────────────────────────────────────────
SUBJECTS_BY_GRADE = {
    "Grade 1": ["Filipino","English","Mathematics","Araling Panlipunan","MAPEH","EsP","MTB-MLE"],
    "Grade 2": ["Filipino","English","Mathematics","Araling Panlipunan","MAPEH","EsP","MTB-MLE"],
    "Grade 3": ["Filipino","English","Mathematics","Science","Araling Panlipunan","MAPEH","EsP"],
}

def get_subjects(grade):
    return SUBJECTS_BY_GRADE.get(grade, list(SUBJECTS_BY_GRADE["Grade 1"]))

def honors_label(avg):
    if avg >= 98: return "With Highest Honors"
    if avg >= 95: return "With High Honors"
    if avg >= 90: return "With Honors"
    return None

# ─── Lightweight token (no PyJWT dependency) ────────────────────────────────
def _sign(data, exp_seconds=86400):
    payload = {**data, "exp": int(time.time()) + exp_seconds}
    encoded = base64.b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET_KEY.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    return f"{encoded}.{sig}"

def _verify(token):
    try:
        encoded, sig = token.rsplit(".", 1)
        expected = hmac.new(SECRET_KEY.encode(), encoded.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected): return None
        payload = json.loads(base64.b64decode(encoded).decode())
        if payload.get("exp", 0) < time.time(): return None
        return payload
    except Exception:
        return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth  = request.headers.get("Authorization", "")
        token = auth.removeprefix("Bearer ").strip()
        payload = _verify(token)
        if not payload:
            return jsonify({"error": "Unauthorized"}), 401
        g.user = payload
        return f(*args, **kwargs)
    return decorated

def require_role(*roles):
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated(*args, **kwargs):
            if g.user.get("role") not in roles:
                return jsonify({"error": "Forbidden"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

# ─── Database ────────────────────────────────────────────────────────────────
def get_db():
    if "db" not in g:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        g.db = conn
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db: db.close()

def row_to_dict(row):  return dict(row) if row else None
def rows_to_list(rows): return [dict(r) for r in rows]

def _hash(pw): return hashlib.sha256(pw.encode()).hexdigest()

def today(): return datetime.date.today().isoformat()
def now_time(): return datetime.datetime.now().strftime("%I:%M %p")

# ─── Schema & seed ───────────────────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.executescript("""
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        email       TEXT UNIQUE NOT NULL,
        password    TEXT NOT NULL,
        role        TEXT NOT NULL CHECK(role IN ('principal','teacher','parent')),
        phone       TEXT,
        avatar      TEXT,
        school      TEXT,
        grade       TEXT,
        section     TEXT,
        teacher_id  TEXT,
        child_id    TEXT,
        created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pending_teachers (
        id           TEXT PRIMARY KEY,
        name         TEXT NOT NULL,
        email        TEXT UNIQUE NOT NULL,
        password     TEXT NOT NULL,
        phone        TEXT,
        grade        TEXT,
        section      TEXT,
        applied_date TEXT DEFAULT (date('now')),
        status       TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected'))
    );

    CREATE TABLE IF NOT EXISTS teachers (
        id       TEXT PRIMARY KEY,
        name     TEXT NOT NULL,
        email    TEXT UNIQUE NOT NULL,
        phone    TEXT,
        grade    TEXT,
        section  TEXT,
        subjects TEXT DEFAULT 'All Subjects',
        status   TEXT DEFAULT 'active',
        joined   TEXT DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS students (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        grade       TEXT NOT NULL,
        section     TEXT NOT NULL,
        gender      TEXT NOT NULL,
        teacher_id  TEXT,
        parent_id   TEXT,
        contact     TEXT,
        status      TEXT DEFAULT 'active',
        enrolled    TEXT DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS parents (
        id        TEXT PRIMARY KEY,
        name      TEXT NOT NULL,
        email     TEXT NOT NULL,
        phone     TEXT,
        child_id  TEXT,
        added_by  TEXT
    );

    CREATE TABLE IF NOT EXISTS classes (
        id         TEXT PRIMARY KEY,
        grade      TEXT NOT NULL,
        section    TEXT NOT NULL,
        teacher_id TEXT,
        year       TEXT DEFAULT '2024-2025'
    );

    CREATE TABLE IF NOT EXISTS grades (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        subject    TEXT NOT NULL,
        q1         INTEGER DEFAULT 0,
        q2         INTEGER DEFAULT 0,
        q3         INTEGER DEFAULT 0,
        q4         INTEGER DEFAULT 0,
        UNIQUE(student_id, subject),
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attendance (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        month      TEXT NOT NULL,
        present    INTEGER DEFAULT 0,
        absent     INTEGER DEFAULT 0,
        late       INTEGER DEFAULT 0,
        total      INTEGER DEFAULT 0,
        UNIQUE(student_id, month),
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        from_role   TEXT,
        from_id     TEXT,
        from_name   TEXT,
        to_role     TEXT,
        to_id       TEXT,
        subject     TEXT,
        body        TEXT,
        date        TEXT DEFAULT (date('now')),
        time        TEXT,
        read        INTEGER DEFAULT 0,
        student_id  TEXT,
        thread_id   INTEGER,
        is_alert    INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS announcements (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT NOT NULL,
        body        TEXT NOT NULL,
        date        TEXT DEFAULT (date('now')),
        audience    TEXT DEFAULT 'all',
        author      TEXT,
        priority    TEXT DEFAULT 'normal',
        author_role TEXT,
        category    TEXT DEFAULT 'general',
        pinned      INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        body  TEXT,
        time  TEXT,
        type  TEXT DEFAULT 'normal',
        read  INTEGER DEFAULT 0,
        role  TEXT DEFAULT 'all'
    );

    CREATE TABLE IF NOT EXISTS alert_log (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT,
        subject    TEXT,
        quarter    TEXT,
        score      INTEGER,
        sent_at    TEXT DEFAULT (datetime('now'))
    );
    """)
    conn.commit()

    if cur.execute("SELECT COUNT(*) FROM users").fetchone()[0] > 0:
        conn.close(); return

    # ── Users ──────────────────────────────────────────────────────────────
    cur.executemany("INSERT INTO users VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", [
        ("principal","Principal Roberto Cruz","principal@tracked.edu",_hash("password123"),"principal",None,None,"Polangui South Central School",None,None,None,None,None),
        ("T001","Ms. Maria Santos","teacher@tracked.edu",_hash("password123"),"teacher","09171111111",None,None,"Grade 1","Sampaguita","T001",None,None),
        ("T002","Mr. Pedro Reyes","preyes@tracked.edu",_hash("password123"),"teacher","09182222222",None,None,"Grade 2","Rosal","T002",None,None),
        ("T003","Ms. Carmen Lim","clim@tracked.edu",_hash("password123"),"teacher","09193333333",None,None,"Grade 3","Gumamela","T003",None,None),
        ("P003","Mr. Juan Dela Cruz","parent@gmail.com",_hash("password123"),"parent","09193456789",None,None,None,None,None,"S003",None),
    ])

    # ── Teachers ───────────────────────────────────────────────────────────
    cur.executemany("INSERT INTO teachers VALUES(?,?,?,?,?,?,?,?,?)", [
        ("T001","Ms. Maria Santos","teacher@tracked.edu","09171111111","Grade 1","Sampaguita","All Subjects","active","2020-06-01"),
        ("T002","Mr. Pedro Reyes","preyes@tracked.edu","09182222222","Grade 2","Rosal","All Subjects","active","2019-06-01"),
        ("T003","Ms. Carmen Lim","clim@tracked.edu","09193333333","Grade 3","Gumamela","All Subjects","active","2021-06-01"),
    ])

    # ── Students ───────────────────────────────────────────────────────────
    cur.executemany("INSERT INTO students VALUES(?,?,?,?,?,?,?,?,?,?)", [
        ("S001","Maria Reyes","Grade 1","Sampaguita","F","T001","P001","09171234567","active","2024-06-01"),
        ("S002","Juan Gomez","Grade 1","Sampaguita","M","T001","P002","09182345678","active","2024-06-01"),
        ("S003","Jose Dela Cruz Jr.","Grade 1","Sampaguita","M","T001","P003","09193456789","active","2024-06-01"),
        ("S004","Ana Santos","Grade 2","Rosal","F","T002","P004","09204567890","active","2024-06-01"),
        ("S005","Pedro Lim","Grade 2","Rosal","M","T002","P005","09215678901","active","2024-06-01"),
        ("S006","Sofia Torres","Grade 2","Rosal","F","T002","P006","09226789012","active","2024-06-01"),
        ("S007","Carlo Ramos","Grade 3","Gumamela","M","T003","P007","09237890123","active","2024-06-01"),
        ("S008","Lisa Tan","Grade 3","Gumamela","F","T003","P008","09248901234","active","2024-06-01"),
        ("S009","Marco Cruz","Grade 3","Gumamela","M","T003","P009","09259012345","active","2024-06-01"),
        ("S010","Nina Bautista","Grade 3","Gumamela","F","T003","P010","09260123456","active","2024-06-01"),
    ])

    # ── Parents ────────────────────────────────────────────────────────────
    cur.executemany("INSERT INTO parents VALUES(?,?,?,?,?,?)", [
        ("P001","Mrs. Liza Reyes","lreyes@gmail.com","09171234567","S001","T001"),
        ("P002","Mr. Carlos Gomez","cgomez@gmail.com","09182345678","S002","T001"),
        ("P003","Mr. Juan Dela Cruz","parent@gmail.com","09193456789","S003","T001"),
        ("P004","Mrs. Rosa Santos","rsantos@gmail.com","09204567890","S004","T002"),
        ("P005","Ms. Aileen Lim","alim@gmail.com","09215678901","S005","T002"),
        ("P006","Mr. Bobby Torres","btorres@gmail.com","09226789012","S006","T002"),
        ("P007","Mrs. Nena Ramos","nramos@gmail.com","09237890123","S007","T003"),
        ("P008","Mr. Anthony Tan","atan@gmail.com","09248901234","S008","T003"),
        ("P009","Mrs. Paz Cruz","pcruz@gmail.com","09259012345","S009","T003"),
        ("P010","Mr. Leo Bautista","lbautista@gmail.com","09260123456","S010","T003"),
    ])

    # ── Classes ────────────────────────────────────────────────────────────
    cur.executemany("INSERT INTO classes VALUES(?,?,?,?,?)", [
        ("C001","Grade 1","Sampaguita","T001","2024-2025"),
        ("C002","Grade 2","Rosal","T002","2024-2025"),
        ("C003","Grade 3","Gumamela","T003","2024-2025"),
    ])

    # ── Grades ─────────────────────────────────────────────────────────────
    grade_data = {
        "S001":{"Filipino":[88,90,87,91],"English":[85,88,82,87],"Mathematics":[88,92,85,90],"Araling Panlipunan":[88,85,89,87],"MAPEH":[90,88,92,91],"EsP":[92,90,88,93],"MTB-MLE":[89,91,87,90]},
        "S002":{"Filipino":[78,80,76,81],"English":[70,73,68,75],"Mathematics":[75,78,72,80],"Araling Panlipunan":[77,75,80,78],"MAPEH":[80,78,82,79],"EsP":[82,80,78,83],"MTB-MLE":[76,78,74,79]},
        "S003":{"Filipino":[95,97,93,96],"English":[90,93,88,92],"Mathematics":[95,97,93,96],"Araling Panlipunan":[91,93,90,94],"MAPEH":[92,94,90,93],"EsP":[96,98,94,97],"MTB-MLE":[93,95,91,96]},
        "S004":{"Filipino":[86,88,84,87],"English":[88,90,86,89],"Mathematics":[82,85,80,84],"Araling Panlipunan":[83,85,82,86],"MAPEH":[85,87,83,88],"EsP":[88,86,90,87]},
        "S005":{"Filipino":[72,74,70,75],"English":[68,65,70,67],"Mathematics":[65,68,62,70],"Araling Panlipunan":[70,68,72,69],"MAPEH":[72,74,70,73],"EsP":[74,72,76,71]},
        "S006":{"Filipino":[92,94,90,93],"English":[88,91,86,90],"Mathematics":[90,93,88,92],"Araling Panlipunan":[87,89,85,91],"MAPEH":[89,91,87,92],"EsP":[91,93,89,94]},
        "S007":{"Filipino":[82,84,80,85],"English":[76,79,73,80],"Mathematics":[78,80,75,82],"Science":[80,82,78,83],"Araling Panlipunan":[79,81,77,83],"MAPEH":[81,83,79,84],"EsP":[83,85,81,86]},
        "S008":{"Filipino":[77,79,75,78],"English":[74,72,76,73],"Mathematics":[72,74,70,76],"Science":[78,75,80,77],"Araling Panlipunan":[73,71,75,72],"MAPEH":[75,77,73,78],"EsP":[77,79,75,80]},
        "S009":{"Filipino":[88,90,86,91],"English":[84,86,82,87],"Mathematics":[86,88,84,89],"Science":[80,82,78,83],"Araling Panlipunan":[82,84,80,85],"MAPEH":[84,86,82,87],"EsP":[86,88,84,89]},
        "S010":{"Filipino":[93,95,91,96],"English":[89,91,87,92],"Mathematics":[91,93,89,94],"Science":[87,89,85,90],"Araling Panlipunan":[85,87,83,88],"MAPEH":[88,90,86,91],"EsP":[91,93,89,94]},
    }
    for sid, subjects in grade_data.items():
        for sub, scores in subjects.items():
            cur.execute("INSERT INTO grades(student_id,subject,q1,q2,q3,q4) VALUES(?,?,?,?,?,?)",
                        (sid, sub, *scores))

    # ── Attendance ─────────────────────────────────────────────────────────
    att_data = {
        "S001":[("June",19,1,0,20),("July",21,0,1,22),("Aug",20,1,0,21)],
        "S002":[("June",18,2,0,20),("July",20,1,1,22),("Aug",19,2,0,21)],
        "S003":[("June",20,0,0,20),("July",22,0,0,22),("Aug",21,0,0,21)],
        "S004":[("June",18,1,1,20),("July",21,1,0,22),("Aug",19,1,1,21)],
        "S005":[("June",15,4,1,20),("July",18,3,1,22),("Aug",16,4,1,21)],
        "S006":[("June",19,0,1,20),("July",22,0,0,22),("Aug",20,1,0,21)],
        "S007":[("June",18,2,0,20),("July",20,2,0,22),("Aug",19,2,0,21)],
        "S008":[("June",16,3,1,20),("July",18,3,1,22),("Aug",15,5,1,21)],
        "S009":[("June",20,0,0,20),("July",21,1,0,22),("Aug",20,1,0,21)],
        "S010":[("June",20,0,0,20),("July",22,0,0,22),("Aug",21,0,0,21)],
    }
    for sid, months in att_data.items():
        for m_data in months:
            cur.execute("INSERT INTO attendance(student_id,month,present,absent,late,total) VALUES(?,?,?,?,?,?)",
                        (sid, m_data[0], m_data[1], m_data[2], m_data[3], m_data[4]))

    # ── Messages ───────────────────────────────────────────────────────────
    cur.executemany("INSERT INTO messages(from_role,from_id,from_name,to_role,to_id,subject,body,date,time,read,student_id,thread_id,is_alert) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", [
        ("parent","P003","Mr. Juan Dela Cruz","teacher","T001","Concern about Math performance",
         "Good day Ma'am Santos. I would like to ask about my son Jose Jr.'s performance in Math this quarter.",
         "2025-01-20","09:30 AM",0,"S003",None,0),
        ("teacher","T001","Ms. Maria Santos","parent","P003","Re: Concern about Math performance",
         "Good day Mr. Dela Cruz! Jose Jr. is doing exceptionally well — he has a 95 in Math this quarter!",
         "2025-01-21","10:15 AM",1,"S003",1,0),
        ("system","system","🔔 TrackEd Alert","parent","P005","Academic Alert: Pedro Lim — Mathematics (Q1)",
         "This is an automated notification from TrackEd.\n\nPedro Lim has received a grade of 65 in Mathematics for Q1, which is below the passing mark of 75.\n\nPlease coordinate with Ms. Maria Santos at your earliest convenience.",
         "2025-01-22","08:00 AM",0,"S005",None,1),
    ])

    # ── Announcements ──────────────────────────────────────────────────────
    cur.executemany("INSERT INTO announcements(title,body,date,audience,author,priority,author_role,category,pinned) VALUES(?,?,?,?,?,?,?,?,?)", [
        ("Q3 Report Cards Ready for Pickup",
         "Grade 1, 2, and 3 report cards for the 3rd quarter are now available at the Registrar's Office. Please bring a valid government-issued ID. Office hours: Mon–Fri, 8:00 AM – 5:00 PM.",
         "2025-01-25","all","Principal Cruz","high","principal","academic",1),
        ("Parent-Teacher Conference – February 5",
         "The quarterly Parent-Teacher Conference is scheduled on Wednesday, February 5, 2025 from 8:00 AM to 12:00 NN. All parents are strongly encouraged to attend.",
         "2025-01-24","all","Principal Cruz","high","principal","event",1),
        ("No Classes – February 25 (EDSA Anniversary)",
         "There will be no classes on Tuesday, February 25, 2025 in observance of the EDSA People Power Revolution Anniversary. Regular classes resume Wednesday, February 26.",
         "2025-01-22","all","Principal Cruz","normal","principal","holiday",0),
        ("Reading Assessment Submission Deadline",
         "All Grade 1 and 2 homeroom teachers must submit reading assessment results by January 30, 2025.",
         "2025-01-23","teacher","Principal Cruz","normal","principal","academic",0),
    ])

    # ── Pending teacher (demo) ─────────────────────────────────────────────
    cur.execute("INSERT INTO pending_teachers VALUES(?,?,?,?,?,?,?,?,?)",
                ("PT001","Ms. Ana Valdez","avaldez@school.edu",_hash("password123"),"09301234567","Grade 1","Sampaguita","2025-01-20","pending"))

    # ── Notifications ──────────────────────────────────────────────────────
    cur.executemany("INSERT INTO notifications(title,body,time,type,read,role) VALUES(?,?,?,?,?,?)", [
        ("Q4 grade submission due","Complete grade entry by Friday.","2h ago","high",0,"teacher"),
        ("Pedro Lim — Failing Grade Alert","Pedro Lim received 65 in Mathematics (Q1). Notification sent to parent.","3h ago","alert",0,"teacher"),
        ("New parent message","Mr. Juan Dela Cruz sent a message.","5h ago","normal",0,"teacher"),
    ])

    conn.commit(); conn.close()
    print("[ TrackEd v2] Database seeded.")


# ─── Helpers ─────────────────────────────────────────────────────────────────
def _avg(scores):
    valid = [s for s in scores if s and s > 0]
    return round(sum(valid) / len(valid)) if valid else 0

def _student_overall(db, student_id, grade):
    subs = get_subjects(grade)
    avgs = []
    for sub in subs:
        row = db.execute("SELECT q1,q2,q3,q4 FROM grades WHERE student_id=? AND subject=?",
                         (student_id, sub)).fetchone()
        if row:
            sc = _avg([row["q1"],row["q2"],row["q3"],row["q4"]])
            if sc > 0: avgs.append(sc)
    return round(sum(avgs)/len(avgs)) if avgs else 0

def _check_and_send_alert(db, student_id, subject, quarter, score, teacher_name):
    """Send auto-alert to parent if grade < 75. Returns True if alert was sent."""
    if score == 0 or score >= 75: return False
    # Check if already alerted for this student/subject/quarter
    existing = db.execute(
        "SELECT id FROM alert_log WHERE student_id=? AND subject=? AND quarter=?",
        (student_id, subject, quarter)
    ).fetchone()
    if existing: return False

    parent = db.execute("SELECT * FROM parents WHERE child_id=?", (student_id,)).fetchone()
    student = db.execute("SELECT name FROM students WHERE id=?", (student_id,)).fetchone()
    if not parent or not student: return False

    parent = dict(parent); student = dict(student)
    body = (
        f"This is an automated notification from TrackEd.\n\n"
        f"{student['name']} has received a grade of {score} in {subject} for {quarter}, "
        f"which is below the passing mark of 75.\n\n"
        f"Please coordinate with {teacher_name} at your earliest convenience "
        f"to discuss how to support your child's academic performance.\n\n"
        f"Thank you for your continued support."
    )
    db.execute(
        "INSERT INTO messages(from_role,from_id,from_name,to_role,to_id,subject,body,date,time,read,student_id,is_alert) VALUES(?,?,?,?,?,?,?,?,?,0,?,1)",
        ("system","system","🔔 TrackEd Alert","parent",parent["id"],
         f"Academic Alert: {student['name']} — {subject} ({quarter})",
         body, today(), now_time(), student_id)
    )
    db.execute("INSERT INTO alert_log(student_id,subject,quarter,score) VALUES(?,?,?,?)",
               (student_id, subject, quarter, score))
    # Notification for teacher
    db.execute("INSERT INTO notifications(title,body,time,type,read,role) VALUES(?,?,?,?,0,?)",
               (f"Alert Sent: {student['name']}",
                f"{student['name']} scored {score} in {subject} ({quarter}). Parent notified.",
                "just now","alert","teacher"))
    return True


# ═══════════════════════════════════════════════════════════════════════════
#  AUTH
# ═══════════════════════════════════════════════════════════════════════════
@app.post("/api/auth/login")
def login():
    data  = request.json or {}
    email = (data.get("email") or "").strip().lower()
    pw    = (data.get("password") or "").strip()
    if not email or not pw:
        return jsonify({"error":"Email and password required"}), 400
    db   = get_db()
    user = row_to_dict(db.execute(
        "SELECT * FROM users WHERE LOWER(email)=? AND password=?", (email, _hash(pw))
    ).fetchone())
    if not user:
        return jsonify({"error":"Invalid email or password"}), 401
    user.pop("password", None)
    token = _sign({"id":user["id"],"role":user["role"],"email":user["email"]})
    return jsonify({"token":token, "user":user})

@app.post("/api/auth/register-teacher")
def register_teacher():
    data  = request.json or {}
    email = (data.get("email") or "").strip().lower()
    name  = (data.get("name") or "").strip()
    pw    = (data.get("password") or "").strip()
    if not name or not email or not pw:
        return jsonify({"error":"name, email and password required"}), 400
    db = get_db()
    if db.execute("SELECT 1 FROM users WHERE LOWER(email)=?", (email,)).fetchone():
        return jsonify({"error":"Email already registered"}), 409
    if db.execute("SELECT 1 FROM pending_teachers WHERE LOWER(email)=?", (email,)).fetchone():
        return jsonify({"error":"Registration already submitted, awaiting approval"}), 409
    count = db.execute("SELECT COUNT(*) FROM pending_teachers").fetchone()[0]
    pid   = f"PT{count+1:03d}"
    db.execute("INSERT INTO pending_teachers(id,name,email,password,phone,grade,section) VALUES(?,?,?,?,?,?,?)",
               (pid, name, email, _hash(pw), data.get("phone",""), data.get("grade","Grade 1"), data.get("section","")))
    db.commit()
    return jsonify({"message":"Registration submitted. Awaiting principal approval."}), 201

@app.post("/api/auth/forgot-password")
def forgot_password():
    email = ((request.json or {}).get("email") or "").strip().lower()
    db = get_db()
    found = db.execute("SELECT id FROM users WHERE LOWER(email)=?", (email,)).fetchone()
    if found:
        return jsonify({"message":f"Reset link sent to {email}"}), 200
    return jsonify({"error":f"No account found for {email}"}), 404

@app.get("/api/me")
@require_auth
def get_me():
    db   = get_db()
    user = row_to_dict(db.execute("SELECT * FROM users WHERE id=?", (g.user["id"],)).fetchone())
    if not user: return jsonify({"error":"Not found"}), 404
    user.pop("password", None)
    return jsonify(user)

@app.patch("/api/me")
@require_auth
def update_me():
    db   = get_db()
    data = request.json or {}
    u    = row_to_dict(db.execute("SELECT * FROM users WHERE id=?", (g.user["id"],)).fetchone())
    if not u: return jsonify({"error":"Not found"}), 404
    db.execute("UPDATE users SET name=?,email=?,phone=?,avatar=?,school=? WHERE id=?",
               (data.get("name",u["name"]), data.get("email",u["email"]),
                data.get("phone",u["phone"]), data.get("avatar",u["avatar"]),
                data.get("school",u["school"]), u["id"]))
    db.commit()
    updated = row_to_dict(db.execute("SELECT * FROM users WHERE id=?", (u["id"],)).fetchone())
    updated.pop("password", None)
    return jsonify(updated)


# ═══════════════════════════════════════════════════════════════════════════
#  PRINCIPAL — TEACHER APPROVALS
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/pending-teachers")
@require_role("principal")
def get_pending_teachers():
    db = get_db()
    return jsonify(rows_to_list(db.execute("SELECT * FROM pending_teachers ORDER BY applied_date DESC").fetchall()))

@app.post("/api/pending-teachers/<ptid>/approve")
@require_role("principal")
def approve_teacher(ptid):
    db = get_db()
    pt = row_to_dict(db.execute("SELECT * FROM pending_teachers WHERE id=?", (ptid,)).fetchone())
    if not pt: return jsonify({"error":"Not found"}), 404
    count = db.execute("SELECT COUNT(*) FROM teachers").fetchone()[0]
    tid   = f"T{count+1:03d}"
    while db.execute("SELECT 1 FROM teachers WHERE id=?", (tid,)).fetchone():
        count += 1; tid = f"T{count+1:03d}"
    db.execute("INSERT INTO teachers(id,name,email,phone,grade,section,subjects,status,joined) VALUES(?,?,?,?,?,?,?,?,?)",
               (tid, pt["name"], pt["email"], pt["phone"] or "", pt["grade"] or "", pt["section"] or "", "All Subjects", "active", today()))
    db.execute("INSERT INTO users(id,name,email,password,role,phone,grade,section,teacher_id) VALUES(?,?,?,?,?,?,?,?,?)",
               (tid, pt["name"], pt["email"], pt["password"], "teacher", pt["phone"], pt["grade"], pt["section"], tid))
    db.execute("UPDATE pending_teachers SET status='approved' WHERE id=?", (ptid,))
    db.commit()
    return jsonify({"approved": tid, "name": pt["name"]})

@app.post("/api/pending-teachers/<ptid>/reject")
@require_role("principal")
def reject_teacher(ptid):
    db = get_db()
    db.execute("UPDATE pending_teachers SET status='rejected' WHERE id=?", (ptid,))
    db.commit()
    return jsonify({"rejected": ptid})


# ═══════════════════════════════════════════════════════════════════════════
#  STUDENTS
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/students")
@require_auth
def get_students():
    db   = get_db()
    role = g.user["role"]
    if role == "teacher":
        rows = db.execute("SELECT * FROM students WHERE teacher_id=? AND status='active'", (g.user["id"],)).fetchall()
    elif role == "parent":
        rows = db.execute("SELECT * FROM students WHERE id=(SELECT child_id FROM users WHERE id=?)", (g.user["id"],)).fetchall()
    else:
        rows = db.execute("SELECT * FROM students").fetchall()
    return jsonify(rows_to_list(rows))

@app.post("/api/students")
@require_role("teacher","principal")
def add_student():
    db = get_db(); data = request.json or {}
    if not data.get("name") or not data.get("grade") or not data.get("section"):
        return jsonify({"error":"name, grade, section required"}), 400
    count = db.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    sid   = f"S{count+1:03d}"
    while db.execute("SELECT 1 FROM students WHERE id=?", (sid,)).fetchone():
        count += 1; sid = f"S{count+1:03d}"
    tid = g.user.get("teacher_id") or g.user["id"]
    db.execute("INSERT INTO students(id,name,grade,section,gender,teacher_id,contact,status,enrolled) VALUES(?,?,?,?,?,?,?,?,?)",
               (sid, data["name"], data["grade"], data["section"], data.get("gender","F"), tid,
                data.get("contact",""), data.get("status","active"), today()))
    db.commit()
    return jsonify(row_to_dict(db.execute("SELECT * FROM students WHERE id=?", (sid,)).fetchone())), 201

@app.put("/api/students/<sid>")
@require_role("teacher","principal")
def update_student(sid):
    db = get_db(); data = request.json or {}
    s  = row_to_dict(db.execute("SELECT * FROM students WHERE id=?", (sid,)).fetchone())
    if not s: return jsonify({"error":"Not found"}), 404
    db.execute("UPDATE students SET name=?,grade=?,section=?,gender=?,contact=?,status=? WHERE id=?",
               (data.get("name",s["name"]), data.get("grade",s["grade"]),
                data.get("section",s["section"]), data.get("gender",s["gender"]),
                data.get("contact",s["contact"]), data.get("status",s["status"]), sid))
    db.commit()
    return jsonify(row_to_dict(db.execute("SELECT * FROM students WHERE id=?", (sid,)).fetchone()))

@app.delete("/api/students/<sid>")
@require_role("teacher","principal")
def delete_student(sid):
    db = get_db()
    db.execute("DELETE FROM students WHERE id=?", (sid,))
    db.commit()
    return jsonify({"deleted":sid})


# ═══════════════════════════════════════════════════════════════════════════
#  TEACHERS  (principal view)
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/teachers")
@require_auth
def get_teachers():
    return jsonify(rows_to_list(get_db().execute("SELECT * FROM teachers").fetchall()))


# ═══════════════════════════════════════════════════════════════════════════
#  PARENTS  (teacher-managed)
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/parents")
@require_auth
def get_parents():
    db   = get_db()
    role = g.user["role"]
    if role == "teacher":
        # Only parents of this teacher's students
        rows = db.execute(
            "SELECT p.* FROM parents p JOIN students s ON p.child_id=s.id WHERE s.teacher_id=?",
            (g.user.get("teacher_id") or g.user["id"],)
        ).fetchall()
    else:
        rows = db.execute("SELECT * FROM parents").fetchall()
    return jsonify(rows_to_list(rows))

@app.post("/api/parents")
@require_role("teacher","principal")
def add_parent():
    db   = get_db(); data = request.json or {}
    name  = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    if not name or not email:
        return jsonify({"error":"name and email required"}), 400
    if db.execute("SELECT 1 FROM users WHERE LOWER(email)=?", (email,)).fetchone():
        return jsonify({"error":"Email already has an account"}), 409
    child_id = data.get("childId") or data.get("child_id")
    count = db.execute("SELECT COUNT(*) FROM parents").fetchone()[0]
    pid   = f"P{count+1:03d}"
    while db.execute("SELECT 1 FROM parents WHERE id=?", (pid,)).fetchone():
        count += 1; pid = f"P{count+1:03d}"
    added_by = g.user.get("teacher_id") or g.user["id"]
    db.execute("INSERT INTO parents(id,name,email,phone,child_id,added_by) VALUES(?,?,?,?,?,?)",
               (pid, name, email, data.get("phone",""), child_id, added_by))
    # Auto-create parent login (default password: tracked2025)
    default_pw = _hash("tracked2025")
    db.execute("INSERT INTO users(id,name,email,password,role,phone,child_id) VALUES(?,?,?,?,?,?,?)",
               (pid, name, email, default_pw, "parent", data.get("phone",""), child_id))
    if child_id:
        db.execute("UPDATE students SET parent_id=? WHERE id=?", (pid, child_id))
    db.commit()
    p = row_to_dict(db.execute("SELECT * FROM parents WHERE id=?", (pid,)).fetchone())
    p["default_password"] = "tracked2025"
    return jsonify(p), 201

@app.put("/api/parents/<pid>")
@require_role("teacher","principal")
def update_parent(pid):
    db = get_db(); data = request.json or {}
    p  = row_to_dict(db.execute("SELECT * FROM parents WHERE id=?", (pid,)).fetchone())
    if not p: return jsonify({"error":"Not found"}), 404
    db.execute("UPDATE parents SET name=?,email=?,phone=? WHERE id=?",
               (data.get("name",p["name"]), data.get("email",p["email"]),
                data.get("phone",p["phone"]), pid))
    db.commit()
    return jsonify(row_to_dict(db.execute("SELECT * FROM parents WHERE id=?", (pid,)).fetchone()))

@app.delete("/api/parents/<pid>")
@require_role("teacher","principal")
def delete_parent(pid):
    db = get_db()
    p  = row_to_dict(db.execute("SELECT * FROM parents WHERE id=?", (pid,)).fetchone())
    if p:
        db.execute("DELETE FROM users WHERE id=?", (pid,))
        if p.get("child_id"):
            db.execute("UPDATE students SET parent_id=NULL WHERE id=?", (p["child_id"],))
    db.execute("DELETE FROM parents WHERE id=?", (pid,))
    db.commit()
    return jsonify({"deleted":pid})


# ═══════════════════════════════════════════════════════════════════════════
#  CLASSES
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/classes")
@require_auth
def get_classes():
    return jsonify(rows_to_list(get_db().execute("SELECT * FROM classes").fetchall()))


# ═══════════════════════════════════════════════════════════════════════════
#  GRADES  (per-subject, per-quarter)
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/grades")
@require_auth
def get_grades():
    db   = get_db()
    role = g.user["role"]
    if role == "parent":
        child = row_to_dict(db.execute("SELECT child_id FROM users WHERE id=?", (g.user["id"],)).fetchone())
        sid   = child["child_id"] if child else None
        rows  = db.execute("SELECT * FROM grades WHERE student_id=?", (sid,)).fetchall() if sid else []
    elif role == "teacher":
        rows = db.execute(
            "SELECT g.* FROM grades g JOIN students s ON g.student_id=s.id WHERE s.teacher_id=?",
            (g.user.get("teacher_id") or g.user["id"],)
        ).fetchall()
    else:
        rows = db.execute("SELECT * FROM grades").fetchall()
    result = {}
    for r in rows:
        r = dict(r)
        result.setdefault(r["student_id"], {})[r["subject"]] = [r["q1"],r["q2"],r["q3"],r["q4"]]
    return jsonify(result)

@app.put("/api/grades/<student_id>/<subject>")
@require_role("teacher","principal")
def update_grade(student_id, subject):
    db   = get_db()
    data = request.json or {}
    q1, q2, q3, q4 = int(data.get("q1",0)), int(data.get("q2",0)), int(data.get("q3",0)), int(data.get("q4",0))
    db.execute(
        "INSERT INTO grades(student_id,subject,q1,q2,q3,q4) VALUES(?,?,?,?,?,?) "
        "ON CONFLICT(student_id,subject) DO UPDATE SET q1=?,q2=?,q3=?,q4=?",
        (student_id, subject, q1,q2,q3,q4, q1,q2,q3,q4)
    )
    db.commit()
    # Auto-alert for each quarter if failing
    quarter_map = {0:"Q1",1:"Q2",2:"Q3",3:"Q4"}
    teacher_name = row_to_dict(db.execute("SELECT name FROM users WHERE id=?", (g.user["id"],)).fetchone() or {}).get("name","the teacher")
    alerts_sent = []
    for qi, score in enumerate([q1,q2,q3,q4]):
        sent = _check_and_send_alert(db, student_id, subject, quarter_map[qi], score, teacher_name)
        if sent: alerts_sent.append(quarter_map[qi])
    if alerts_sent: db.commit()
    return jsonify({"student_id":student_id,"subject":subject,"scores":[q1,q2,q3,q4],"alerts_sent":alerts_sent})

@app.put("/api/grades/bulk")
@require_role("teacher","principal")
def bulk_update_grades():
    """Body: { "S001": { "Math": [q1,q2,q3,q4], ... }, ... }"""
    db   = get_db()
    data = request.json or {}
    teacher_name = row_to_dict(db.execute("SELECT name FROM users WHERE id=?", (g.user["id"],)).fetchone() or {}).get("name","the teacher")
    total_alerts = 0
    quarter_map  = {0:"Q1",1:"Q2",2:"Q3",3:"Q4"}
    for sid, subjects in data.items():
        for sub, scores in subjects.items():
            scores = (list(scores) + [0,0,0,0])[:4]
            q1,q2,q3,q4 = [int(s) for s in scores]
            db.execute(
                "INSERT INTO grades(student_id,subject,q1,q2,q3,q4) VALUES(?,?,?,?,?,?) "
                "ON CONFLICT(student_id,subject) DO UPDATE SET q1=?,q2=?,q3=?,q4=?",
                (sid,sub,q1,q2,q3,q4,q1,q2,q3,q4)
            )
            for qi, score in enumerate([q1,q2,q3,q4]):
                if _check_and_send_alert(db, sid, sub, quarter_map[qi], score, teacher_name):
                    total_alerts += 1
    db.commit()
    return jsonify({"updated":len(data),"alerts_sent":total_alerts})


# ═══════════════════════════════════════════════════════════════════════════
#  ATTENDANCE  (monthly)
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/attendance")
@require_auth
def get_attendance():
    db   = get_db()
    role = g.user["role"]
    if role == "parent":
        child = row_to_dict(db.execute("SELECT child_id FROM users WHERE id=?", (g.user["id"],)).fetchone())
        sid   = child["child_id"] if child else None
        rows  = db.execute("SELECT * FROM attendance WHERE student_id=?", (sid,)).fetchall() if sid else []
    elif role == "teacher":
        rows = db.execute(
            "SELECT a.* FROM attendance a JOIN students s ON a.student_id=s.id WHERE s.teacher_id=?",
            (g.user.get("teacher_id") or g.user["id"],)
        ).fetchall()
    else:
        rows = db.execute("SELECT * FROM attendance").fetchall()

    # Build: { studentId: { monthly:[{m,p,a,l,t},...], total:{...} } }
    result = {}
    for r in rows:
        r = dict(r)
        sid = r["student_id"]
        if sid not in result:
            result[sid] = {"monthly":[], "total":{"present":0,"absent":0,"late":0,"total":0}}
        result[sid]["monthly"].append({"m":r["month"],"p":r["present"],"a":r["absent"],"l":r["late"],"t":r["total"]})
        t = result[sid]["total"]
        t["present"] += r["present"]; t["absent"] += r["absent"]
        t["late"]    += r["late"];    t["total"]  += r["total"]
    return jsonify(result)

@app.post("/api/attendance/mark")
@require_role("teacher")
def mark_attendance():
    """Body: { "month":"June", "records":{ "S001":"Present", "S002":"Absent", ... } }"""
    db   = get_db()
    data = request.json or {}
    month   = data.get("month","")
    records = data.get("records",{})
    for sid, status in records.items():
        existing = db.execute("SELECT * FROM attendance WHERE student_id=? AND month=?", (sid, month)).fetchone()
        if not existing:
            db.execute("INSERT INTO attendance(student_id,month,present,absent,late,total) VALUES(?,?,0,0,0,0)", (sid, month))
        if status == "Absent":
            db.execute("UPDATE attendance SET absent=absent+1,total=total+1 WHERE student_id=? AND month=?", (sid, month))
        elif status == "Late":
            db.execute("UPDATE attendance SET late=late+1,present=present+1,total=total+1 WHERE student_id=? AND month=?", (sid, month))
        else:
            db.execute("UPDATE attendance SET present=present+1,total=total+1 WHERE student_id=? AND month=?", (sid, month))
    db.commit()
    return jsonify({"marked":len(records), "month":month})


# ═══════════════════════════════════════════════════════════════════════════
#  RANKING
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/ranking")
@require_auth
def get_ranking():
    """
    Query params:
      mode=section&section=Sampaguita
      mode=grade&grade=Grade%201
    Returns ranked list with honors label.
    """
    db     = get_db()
    mode   = request.args.get("mode","section")
    grade  = request.args.get("grade","Grade 1")
    section= request.args.get("section","Sampaguita")

    if mode == "section":
        students = rows_to_list(db.execute(
            "SELECT * FROM students WHERE section=? AND status='active'", (section,)
        ).fetchall())
    else:
        students = rows_to_list(db.execute(
            "SELECT * FROM students WHERE grade=? AND status='active'", (grade,)
        ).fetchall())

    # Restrict teacher to own students
    if g.user["role"] == "teacher":
        tid = g.user.get("teacher_id") or g.user["id"]
        students = [s for s in students if s.get("teacher_id") == tid]

    ranked = []
    for s in students:
        overall = _student_overall(db, s["id"], s["grade"])
        ranked.append({**s, "overall": overall, "honors": honors_label(overall)})
    ranked.sort(key=lambda x: -x["overall"])
    for i, r in enumerate(ranked): r["rank"] = i+1
    return jsonify(ranked)


# ═══════════════════════════════════════════════════════════════════════════
#  MESSAGES
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/messages")
@require_auth
def get_messages():
    db   = get_db()
    uid  = g.user["id"]
    role = g.user["role"]
    if role == "principal":
        rows = db.execute("SELECT * FROM messages ORDER BY date DESC, time DESC").fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM messages WHERE from_id=? OR to_id=? ORDER BY date DESC, time DESC",
            (uid, uid)
        ).fetchall()
    msgs = rows_to_list(rows)
    for m in msgs:
        m["fromRole"] = m.pop("from_role",None)
        m["fromId"]   = m.pop("from_id",None)
        m["fromName"] = m.pop("from_name",None)
        m["toRole"]   = m.pop("to_role",None)
        m["toId"]     = m.pop("to_id",None)
        m["studentId"]= m.pop("student_id",None)
        m["thread"]   = m.pop("thread_id",None)
        m["isAlert"]  = bool(m.pop("is_alert",0))
        m["read"]     = bool(m["read"])
    return jsonify(msgs)

@app.post("/api/messages")
@require_auth
def send_message():
    db   = get_db(); data = request.json or {}; u = g.user
    if not data.get("subject") or not data.get("body"):
        return jsonify({"error":"subject and body required"}), 400
    cur = db.execute(
        "INSERT INTO messages(from_role,from_id,from_name,to_role,to_id,subject,body,date,time,read,student_id,thread_id,is_alert) VALUES(?,?,?,?,?,?,?,?,?,0,?,?,0)",
        (u["role"], u["id"], data.get("fromName",""),
         data.get("toRole",""), data.get("toId",""),
         data["subject"], data["body"],
         today(), now_time(),
         data.get("studentId"), data.get("thread"))
    )
    db.commit()
    return jsonify({"id":cur.lastrowid}), 201

@app.patch("/api/messages/<int:mid>/read")
@require_auth
def mark_read(mid):
    db = get_db()
    db.execute("UPDATE messages SET read=1 WHERE id=?", (mid,))
    db.commit()
    return jsonify({"read":True})


# ═══════════════════════════════════════════════════════════════════════════
#  ANNOUNCEMENTS
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/announcements")
@require_auth
def get_announcements():
    db   = get_db(); role = g.user["role"]
    rows = db.execute(
        "SELECT * FROM announcements WHERE audience='all' OR audience=? ORDER BY pinned DESC, date DESC",
        (role,)
    ).fetchall()
    return jsonify(rows_to_list(rows))

@app.post("/api/announcements")
@require_role("principal")
def add_announcement():
    db   = get_db(); data = request.json or {}
    if not data.get("title") or not data.get("body"):
        return jsonify({"error":"title and body required"}), 400
    cur = db.execute(
        "INSERT INTO announcements(title,body,audience,author,priority,author_role,category,pinned) VALUES(?,?,?,?,?,?,?,?)",
        (data["title"], data["body"], data.get("audience","all"),
         data.get("author","Principal"), data.get("priority","normal"),
         g.user["role"], data.get("category","general"),
         1 if data.get("pinned") else 0)
    )
    db.commit()
    return jsonify(row_to_dict(db.execute("SELECT * FROM announcements WHERE id=?", (cur.lastrowid,)).fetchone())), 201

@app.put("/api/announcements/<int:aid>")
@require_role("principal")
def update_announcement(aid):
    db = get_db(); data = request.json or {}
    a  = row_to_dict(db.execute("SELECT * FROM announcements WHERE id=?", (aid,)).fetchone())
    if not a: return jsonify({"error":"Not found"}), 404
    db.execute("UPDATE announcements SET title=?,body=?,audience=?,priority=?,category=?,pinned=? WHERE id=?",
               (data.get("title",a["title"]), data.get("body",a["body"]),
                data.get("audience",a["audience"]), data.get("priority",a["priority"]),
                data.get("category",a.get("category","general")),
                1 if data.get("pinned") else 0, aid))
    db.commit()
    return jsonify(row_to_dict(db.execute("SELECT * FROM announcements WHERE id=?", (aid,)).fetchone()))

@app.delete("/api/announcements/<int:aid>")
@require_role("principal")
def delete_announcement(aid):
    db = get_db()
    db.execute("DELETE FROM announcements WHERE id=?", (aid,))
    db.commit()
    return jsonify({"deleted":aid})


# ═══════════════════════════════════════════════════════════════════════════
#  NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/notifications")
@require_auth
def get_notifications():
    db   = get_db(); role = g.user["role"]
    rows = db.execute(
        "SELECT * FROM notifications WHERE role=? OR role='all' ORDER BY id DESC", (role,)
    ).fetchall()
    return jsonify(rows_to_list(rows))

@app.post("/api/notifications/mark-read")
@require_auth
def mark_notifications_read():
    db = get_db(); role = g.user["role"]
    db.execute("UPDATE notifications SET read=1 WHERE role=? OR role='all'", (role,))
    db.commit()
    return jsonify({"ok":True})


# ═══════════════════════════════════════════════════════════════════════════
#  REPORT CARD DATA
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/report-card/<student_id>")
@require_auth
def get_report_card(student_id):
    db = get_db()
    s  = row_to_dict(db.execute("SELECT * FROM students WHERE id=?", (student_id,)).fetchone())
    if not s: return jsonify({"error":"Not found"}), 404
    subs   = get_subjects(s["grade"])
    grades = {}
    for sub in subs:
        row = db.execute("SELECT q1,q2,q3,q4 FROM grades WHERE student_id=? AND subject=?",
                         (student_id, sub)).fetchone()
        grades[sub] = list(row) if row else [0,0,0,0]
    att_rows = db.execute("SELECT * FROM attendance WHERE student_id=? ORDER BY id", (student_id,)).fetchall()
    monthly  = [{"m":r["month"],"p":r["present"],"a":r["absent"],"l":r["late"],"t":r["total"]} for r in att_rows]
    total_att= {"present":sum(r["present"] for r in att_rows),"absent":sum(r["absent"] for r in att_rows),
                "late":sum(r["late"] for r in att_rows),"total":sum(r["total"] for r in att_rows)}
    teacher  = row_to_dict(db.execute("SELECT name FROM teachers WHERE id=?", (s.get("teacher_id",""),)).fetchone())
    parent   = row_to_dict(db.execute("SELECT name,email,phone FROM parents WHERE child_id=?", (student_id,)).fetchone())
    overall  = _student_overall(db, student_id, s["grade"])
    return jsonify({
        "student": s,
        "subjects": subs,
        "grades": grades,
        "overall": overall,
        "honors": honors_label(overall),
        "attendance": {"monthly":monthly, "total":total_att},
        "teacher": teacher,
        "parent": parent,
    })


# ═══════════════════════════════════════════════════════════════════════════
#  DASHBOARD SUMMARY
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/dashboard")
@require_auth
def dashboard():
    db   = get_db(); uid = g.user["id"]; role = g.user["role"]
    total_students  = db.execute("SELECT COUNT(*) FROM students WHERE status='active'").fetchone()[0]
    total_teachers  = db.execute("SELECT COUNT(*) FROM teachers WHERE status='active'").fetchone()[0]
    pending_apps    = db.execute("SELECT COUNT(*) FROM pending_teachers WHERE status='pending'").fetchone()[0]
    unread_msgs     = db.execute("SELECT COUNT(*) FROM messages WHERE read=0 AND to_id=?", (uid,)).fetchone()[0]
    return jsonify({
        "totalStudents":  total_students,
        "totalTeachers":  total_teachers,
        "pendingApprovals": pending_apps,
        "unreadMessages": unread_msgs,
    })


# ═══════════════════════════════════════════════════════════════════════════
#  HEALTH
# ═══════════════════════════════════════════════════════════════════════════
@app.get("/api/health")
def health():
    return jsonify({"status":"ok","app":"TrackEd API v2","version":"2.0.0"})


if __name__ == "__main__":
    init_db()
    print("[TrackEd v2] API → http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)