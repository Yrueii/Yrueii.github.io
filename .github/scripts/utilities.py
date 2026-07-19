import requests
import hashlib
import sys
import yaml
import os
from datetime import datetime, timezone

class utilities:

    def __init__(self, UPSTREAM_URL, STATE_FILE, FILENAME):
        self.UPSTREAM_URL = UPSTREAM_URL
        self.STATE_FILE = STATE_FILE
        self.FILENAME = FILENAME

    def get_file_hash(self, file_path):
        """Calculate SHA256 hash of a file"""
        sha256 = hashlib.sha256()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256.update(chunk)
        return sha256.hexdigest()

    def download_upstream_file(self):
        """Download the upstream logicids.dat file"""
        print(f"Downloading {self.UPSTREAM_URL}")
        response = requests.get(self.UPSTREAM_URL)
        response.raise_for_status()
        
        temp_file = f"/tmp/{self.FILENAME}"
        with open(temp_file, 'wb') as f:
            f.write(response.content)
        
        return temp_file

    def load_state(self):
        """Load the stored state file"""
        if os.path.exists(self.STATE_FILE):
            with open(self.STATE_FILE, 'r') as f:
                return (yaml.safe_load(f) or {}).get(self.FILENAME) or {}
        return {}

    def save_state(self, sha256_hash):
        """Save the state file with the new SHA256"""
        # 1. LOAD existing data (or create empty dict if file doesn't exist)
        if os.path.exists(self.STATE_FILE):
            with open(self.STATE_FILE, 'r') as f:
                state_data = yaml.safe_load(f) or {}
        else:
            state_data = {}
        
        # 2. MODIFY the specific entry
        state_data[self.FILENAME] = {
            "upstream_sha256": sha256_hash,
            "last_updated": datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
        }
        
        # 3. WRITE the entire updated structure back
        with open(self.STATE_FILE, 'w') as f:
            yaml.dump(state_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False, indent=2)
        
        print(f"Updated state file: {self.STATE_FILE}")