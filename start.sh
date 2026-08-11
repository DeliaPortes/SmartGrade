#!/usr/bin/env bash
# TrackEd v2 — One-command launcher
# Usage: bash start.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║          TrackEd  v2.0                        ║"
echo "║  Academic Monitoring & Communication System      ║"
echo "║  Polangui South Central School                   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Check Python
command -v python3 &>/dev/null || { echo "❌ python3 not found"; exit 1; }

# Install Python deps if needed
python3 -c "import flask, flask_cors" 2>/dev/null || {
  echo "📦 Installing dependencies..."
  pip install flask flask-cors --break-system-packages -q
}

# Start API
echo "🚀  Starting API   → http://localhost:5000"
cd "$SCRIPT_DIR/backend" && python3 app.py &
API_PID=$!
sleep 2

# Serve frontend
echo "🌐  Starting App   → http://localhost:8080"
cd "$SCRIPT_DIR/frontend" && python3 -m http.server 8080 --bind 127.0.0.1 &
FE_PID=$!

echo ""
echo "✅  TrackEd v2 is running!"
echo ""
echo "   Open in browser → http://localhost:8080"
echo ""
echo "   ─────────────────────────────────────────────"
echo "   CREDENTIALS:"
echo "   🏫 Principal : principal@tracked.edu / password123"
echo "   📚 Teacher 1 : teacher@tracked.edu   / password123"
echo "   📚 Teacher 2 : preyes@tracked.edu    / password123"
echo "   📚 Teacher 3 : clim@tracked.edu      / password123"
echo "   👨‍👩‍👧 Parent    : parent@gmail.com        / password123"
echo "   ─────────────────────────────────────────────"
echo "   Teacher registration: click 'Register as Teacher'"
echo "   on the login page, then approve in Principal account."
echo "   ─────────────────────────────────────────────"
echo ""
echo "   Press Ctrl+C to stop."
echo ""

trap "echo ''; echo 'Stopping...'; kill $API_PID $FE_PID 2>/dev/null; echo 'Done.'" SIGINT SIGTERM
wait