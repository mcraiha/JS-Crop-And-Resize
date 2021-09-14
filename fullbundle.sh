#!/bin/bash
# Fill variables
current_date=$(date --iso-8601=minutes)
tsc_version=$(deno eval "console.log(Deno.version.typescript)")
git_short_hash=$(git rev-parse --short HEAD)

echo $current_date
echo $tsc_version
echo $git_short_hash

sed -i "s/{0}/$tsc_version/g" src/crop-and-resize.ts
sed -i "s/{1}/$git_short_hash/g" src/crop-and-resize.ts
sed -i "s/{2}/$current_date/g" src/crop-and-resize.ts

deno bundle -c tsconfig.json src/crop-and-resize.ts src/crop-and-resize.js