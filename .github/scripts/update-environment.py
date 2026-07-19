import re
import yaml
import utilities
import os

UPSTREAM_URL = "https://raw.githubusercontent.com/Anuken/Mindustry/master/core/src/mindustry/content/Blocks.java"
STATE_FILE = ".github/upstream-state.yaml"
OUTPUT_DIR = "MlogDocs/Languages/v8/static/"

util = utilities.utilities(UPSTREAM_URL, STATE_FILE)

class IndentDumper(yaml.Dumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)

def extract_strings_in_region(file_path, region_name="environment"):
    """
    Extract string arguments from patterns within a specific region.
    
    Region format:
    //region environment
    ... code here ...
    //endregion
    """
    # Pattern for the region markers
    region_start = f"//region {region_name}"
    region_end = "//endregion"
    
    # Pattern for finding string arguments
    string_pattern = r'new\s+\w+\s*\(\s*["\']([^"\']*)["\']\s*\)'
    
    results = []
    in_region = False
    
    with open(file_path, 'r') as file:
        items = []
        for line_num, line in enumerate(file, 1):
            # Check for region start
            if region_start in line:
                in_region = True
                continue
            
            # Check for region end
            if region_end in line and in_region:
                in_region = False
                continue
            
            # If we're inside the region, look for matches
            if in_region:
                matches = re.findall(string_pattern, line)
                for match in matches:
                    items.append(f"@{match}")

        if items:
            output_file = f"{region_name}.yaml"
            yaml_data = {region_name: items}

            with open(f"{OUTPUT_DIR}{output_file}", 'w') as f:
                yaml.dump(yaml_data, f, Dumper=IndentDumper, default_flow_style=False, allow_unicode=True, sort_keys=False, indent=2)

            print(f"✓ Generated {output_file} with {len(items)} {region_name}")

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
    extract_strings_in_region(temp_file, "environment")
    
    # Update the state file
    util.save_state(new_hash, filename)

    # Clean up temp file
    os.remove(temp_file)
    
    print("✓ Update complete")

if __name__ == "__main__":
    main()