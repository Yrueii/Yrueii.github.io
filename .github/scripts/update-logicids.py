#!/usr/bin/env python3
import struct
import yaml
import requests
import hashlib
import os
import sys
from datetime import datetime, timezone

UPSTREAM_URL = "https://raw.githubusercontent.com/Anuken/Mindustry/master/core/assets/logicids.dat"
STATE_FILE = ".github/upstream-state.yaml"
OUTPUT_DIR = "MlogDocs/Languages/v8/static/"
CONTENT_TYPES = ["blocks", "units", "items", "liquids"]

class IndentDumper(yaml.Dumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)

def get_file_hash(file_path):
    """Calculate SHA256 hash of a file"""
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def download_upstream_file():
    """Download the upstream logicids.dat file"""
    print(f"Downloading {UPSTREAM_URL}")
    response = requests.get(UPSTREAM_URL)
    response.raise_for_status()
    
    temp_file = "/tmp/logicids.dat"
    with open(temp_file, 'wb') as f:
        f.write(response.content)
    
    return temp_file

def load_state():
    """Load the stored state file"""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return yaml.safe_load(f) or {}
    return {}

def save_state(sha256_hash):
    """Save the state file with the new SHA256"""
    state_yaml = (
        f"upstream_sha256: {sha256_hash}\n"
        f"last_updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
    )
    with open(STATE_FILE, 'w') as f:
        f.write(state_yaml)
    print(f"Updated state file: {STATE_FILE}")

def parse_logicids(file_path):
    """Parse the logicids.dat file and generate YAML files"""
    with open(file_path, 'rb') as f:
        data = f.read()
    
    offset = 0
    
    for ctype_name in CONTENT_TYPES:
        if offset + 2 > len(data):
            break
        
        count = struct.unpack('>H', data[offset:offset+2])[0]
        offset += 2
        
        items = []
        for i in range(count):
            if offset + 2 > len(data):
                break
            
            str_len = struct.unpack('>H', data[offset:offset+2])[0]
            offset += 2
            
            if offset + str_len > len(data):
                break
            
            name = data[offset:offset+str_len].decode('utf-8', errors='replace')
            offset += str_len
            
            items.append(f"@{name}")
        
        if items:
            output_file = f"{ctype_name}.yaml"
            yaml_data = {ctype_name: items}
            
            with open(f"{OUTPUT_DIR}{output_file}", 'w') as f:
                yaml.dump(yaml_data, f, Dumper=IndentDumper, default_flow_style=False, allow_unicode=True, sort_keys=False, indent=2)
            
            print(f"✓ Generated {output_file} with {len(items)} {ctype_name}")
        
        if offset >= len(data):
            break

def main():
    # Download upstream file
    temp_file = download_upstream_file()
    
    # Get hash of downloaded file
    new_hash = get_file_hash(temp_file)
    print(f"Upstream file SHA256: {new_hash}")
    
    # Load stored state
    state = load_state()
    stored_hash = state.get("upstream_sha256")
    
    # Check if we need to update
    if stored_hash == new_hash:
        print(f"No changes detected (hash: {new_hash[:12]}...)")
        return
    
    if stored_hash:
        print(f"Changes detected!")
        print(f"  Old hash: {stored_hash[:12]}...")
        print(f"  New hash: {new_hash[:12]}...")
    else:
        print("No previous state found. Generating initial files...")
    
    # Parse the downloaded file
    parse_logicids(temp_file)
    
    # Update the state file
    save_state(new_hash)
    
    # Clean up temp file
    os.remove(temp_file)
    
    print("✓ Update complete")

if __name__ == "__main__":
    main()