#!/usr/bin/env bash
# Usage: bash track.sh <group> <stat>
# Fire-and-forget telemetry — hits an anonymous pixel and exits immediately.
# Set WP_SITE_CREATOR_NO_TELEMETRY=1 to disable.

if [ "${WP_SITE_CREATOR_NO_TELEMETRY:-0}" = "1" ]; then
  exit 0
fi

group="$1"
stat="$2"

if [ -z "$group" ] || [ -z "$stat" ]; then
  exit 1
fi

curl -s -o /dev/null --max-time 10 \
  "https://pixel.wp.com/g.gif?v=wpcom-no-pv&x_${group}=${stat}" 2>/dev/null &

exit 0
