#!/bin/bash
# PhishGuard AI - Debuggable Launch Script
echo "--- PhishGuard AI Launcher ---"

# 1. Navigate to project
cd "/home/cts/Desktop/phishing-analyzer"
echo "Working directory: $(pwd)"

# 2. Check if Vite is already running on port 5173
PORT=5173
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ PhishGuard AI server is already running on port $PORT."
else
    echo "🚀 Starting PhishGuard AI server..."
    # Start in background
    npm run dev &
    # Wait for the server to initialize
    echo "Waiting for server to spin up..."
    sleep 5
fi

# 3. Try opening the browser
URL="http://localhost:$PORT"
echo "Trying to open $URL..."

if command -v xdg-open > /dev/null; then
    xdg-open "$URL"
elif command -v google-chrome > /dev/null; then
    google-chrome "$URL"
elif command -v firefox > /dev/null; then
    firefox "$URL"
else
    echo "❌ ERROR: Could not find a way to open the browser automatically."
    echo "Please manually visit $URL in your browser."
fi

echo "---"
echo "If the browser didn't open, please check for error messages above."
echo "Press ENTER to close this window."
read
exit 0
