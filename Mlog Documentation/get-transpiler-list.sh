#!/usr/bin/bash
cd -- "$(command dirname -- "$0")" || exit

hash curl jq || exit

api_url=https://api.github.com/repos
file=./transpiler-datas.json

:> "$file"

mapfile -t repos < ./transpiler-repos || exit

for line in "${repos[@]}"; do
    url=${line%%  *}
    name=${line##*  }

    repo=${url#*/*/*/}
    request_url=$api_url/$repo
    curl "$request_url" |
        jq --arg short_name "$name" '.+{$short_name}' >> "$file"
    if [ "${PIPESTATUS[0]}" -ne 0 ]; then
        echo "curl failed (${PIPESTATUS[0]})" >&2
        exit "${PIPESTATUS[0]}"
    fi
done

echo 'Update transpiler list finish!'
echo 'Run jq -nrf gen-transpiler-list.jq'
