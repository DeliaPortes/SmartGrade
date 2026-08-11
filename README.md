# TrackEd – Backend & API

Academic Monitoring & Communication System for Polangui South Central School.

---

## 📁 Project Structure

```
tracked/
├── backend/
│   └── app.py            ← Flask REST API + SQLite DB
├── frontend/
│   ├── index.html        ← Main HTML (updated — loads 3 JS files)
│   ├── style.css         ← All styles (unchanged)
│   ├── script.js         ← All UI render functions (unchanged)
│   ├── api.js            ← API client + STATE sync + mutation patches
│   └── app-bootstrap.js  ← doLogin / doLogout / auto-login overrides
├── start.sh              ← One-command launcher
└── README.md
```

---

## 🚀 Quick Start

```bash
bash start.sh
```

Then open **http://localhost:8080** in your browser.

### Manual start (two terminals)

```bash
# Terminal 1 — API
cd backend
python3 app.py

# Terminal 2 — Frontend
cd frontend
python3 -m http.server 8080
```

---

## 🔐 Demo Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@tracked.edu       | password123 |
| Teacher | teacher@tracked.edu     | password123 |
| Parent  | parent@gmail.com           | password123 |

---

## 🗄️ Database

SQLite file: `backend/tracked.db` (auto-created on first run)

**Tables:** `users`, `students`, `teachers`, `parents`, `parent_children`, `classes`, `grades`, `attendance`, `messages`, `announcements`, `notifications`

To reset the database: `rm backend/tracked.db` then restart.

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/login` | `{ email, password }` → `{ token, user }` |
| `POST` | `/auth/forgot-password` | `{ email }` |
| `GET`  | `/me` | Get current user |
| `PATCH`| `/me` | Update profile `{ name, email, phone, avatar, school }` |

### Students
| Method | Path | Roles |
|--------|------|-------|
| `GET`    | `/students`        | all (filtered by role) |
| `POST`   | `/students`        | admin, teacher |
| `PUT`    | `/students/:id`    | admin, teacher |
| `DELETE` | `/students/:id`    | admin |

### Teachers
| Method | Path | Roles |
|--------|------|-------|
| `GET`    | `/teachers`        | all |
| `POST`   | `/teachers`        | admin |
| `PUT`    | `/teachers/:id`    | admin |
| `DELETE` | `/teachers/:id`    | admin |

### Parents
| Method | Path | Roles |
|--------|------|-------|
| `GET`    | `/parents`         | all |
| `POST`   | `/parents`         | admin |
| `PUT`    | `/parents/:id`     | admin |
| `DELETE` | `/parents/:id`     | admin |

### Classes
| Method | Path | Roles |
|--------|------|-------|
| `GET`    | `/classes`         | all |
| `POST`   | `/classes`         | admin |
| `PUT`    | `/classes/:id`     | admin |
| `DELETE` | `/classes/:id`     | admin |

### Grades
| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/grades` | Returns `{ studentId: { subject: [q1,q2,q3,q4] } }` |
| `PUT` | `/grades/:studentId/:subject` | `{ q1, q2, q3, q4 }` |
| `PUT` | `/grades/bulk` | Bulk update (entire grades object) |

### Attendance
| Method | Path | Notes |
|--------|------|-------|
| `GET`  | `/attendance` | Returns `{ studentId: { present, absent, late, total } }` |
| `POST` | `/attendance/mark` | `{ date, records: { S001: "Present", S002: "Absent" } }` |

### Messages
| Method | Path | Notes |
|--------|------|-------|
| `GET`  | `/messages` | Filtered by role/id |
| `POST` | `/messages` | `{ fromName, toRole, toId, subject, body, studentId?, thread? }` |
| `PATCH`| `/messages/:id/read` | Mark single message read |

### Announcements
| Method | Path | Roles |
|--------|------|-------|
| `GET`    | `/announcements`     | all (filtered by audience) |
| `POST`   | `/announcements`     | admin |
| `PUT`    | `/announcements/:id` | admin |
| `DELETE` | `/announcements/:id` | admin |

### Notifications
| Method | Path |
|--------|------|
| `GET`  | `/notifications` |
| `POST` | `/notifications/mark-read` |

### Dashboard
| Method | Path |
|--------|------|
| `GET` | `/dashboard` |

### Health
| Method | Path |
|--------|------|
| `GET` | `/health` |

---

## 🏗️ Architecture

```
Browser (Frontend)
    │
    │  HTTP + Bearer token
    ▼
Flask REST API  (port 5000)
    │
    │  SQL queries
    ▼
SQLite Database (tracked.db)
```

**How the integration works:**

1. `script.js` — all UI rendering, unchanged. Reads/writes `STATE` object.
2. `api.js` — after login, fetches all data from the API and populates `STATE`. Also monkey-patches save/delete functions to call the API before updating `STATE`.
3. `app-bootstrap.js` — overrides `doLogin`/`doLogout` to use the API. Falls back to local `STATE.users` if the backend is offline.

**Fallback behavior:** If the API is unreachable, the app falls back to the hardcoded `STATE` data in `script.js`, so it still works offline (changes won't persist).

---

## 🔒 Security Notes

- Passwords stored as SHA-256 hashes (upgrade to bcrypt for production)
- Tokens use HMAC-SHA256 with a secret key, expire after 24 hours
- CORS is open (`*`) — restrict to your domain in production
- Set `SECRET_KEY` environment variable in production:
  ```bash
  SECRET_KEY=your-production-secret python3 app.py
  ```

---

## 📦 Dependencies

**Backend (Python)**
- `flask` — web framework
- `flask-cors` — CORS headers

**Frontend**
- No new dependencies — uses the browser's native `fetch` API

---

## 🛠️ Extending

### Add a new API endpoint
```python
@app.get("/api/my-endpoint")
@require_auth
def my_endpoint():
    db = get_db()
    # query, return jsonify(...)
```

### Change password hashing to bcrypt (production)
```bash
pip install bcrypt
```
```python
import bcrypt
# Hash:   bcrypt.hashpw(password.encode(), bcrypt.gensalt())
# Verify: bcrypt.checkpw(password.encode(), stored_hash)
```
