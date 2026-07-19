#!/usr/bin/env python3
import struct
import yaml
import os
import utilities

UPSTREAM_URL = "https://raw.githubusercontent.com/Anuken/Mindustry/master/core/assets/logicids.dat"
FILENAME = "logicids.dat"
STATE_FILE = ".github/upstream-state.yaml"
OUTPUT_DIR = "MlogDocs/Languages/v8/static/"
CONTENT_TYPES = ["blocks", "units", "items", "liquids"]

util = utilities.utilities(UPSTREAM_URL, STATE_FILE, FILENAME)
class IndentDumper(yaml.Dumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)

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
    temp_file = util.download_upstream_file()
    filename = os.path.basename(temp_file)
    
    # Get hash of downloaded file
    new_hash = util.get_file_hash(temp_file)
    print(f"Upstream file SHA256: {new_hash}")
    
    # Load stored state
    state = util.load_state(filename)
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
    util.save_state(new_hash, filename)
    
    # Clean up temp file
    os.remove(temp_file)
    
    print("✓ Update complete")

if __name__ == "__main__":
    main()