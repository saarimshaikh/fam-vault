"""
FamVault - Local Development & Production Preview Server
Serves the application with correct MIME types for ES Modules and modern web standards.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 5173
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class FamVaultHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        # Ensure proper MIME type for JavaScript modules
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.json'):
            return 'application/json'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

def run():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    
    # Try finding an open port starting from PORT
    port = PORT
    server = None
    for attempt in range(5):
        try:
            server = socketserver.TCPServer(("", port), FamVaultHandler)
            break
        except OSError:
            port += 1

    if not server:
        print(f"Could not bind to port {PORT}-{PORT+4}")
        sys.exit(1)

    url = f"http://localhost:{port}"
    print("=" * 60)
    print(f"🛡️  FamVault - Family Emergency Document Archive")
    print(f"🚀  Running live at: {url}")
    print(f"📂  Serving files from: {DIRECTORY}")
    print("=" * 60)
    print("Press Ctrl+C to stop the server.")

    # Open in browser automatically if interactive
    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping FamVault server...")
        server.server_close()

if __name__ == '__main__':
    run()
