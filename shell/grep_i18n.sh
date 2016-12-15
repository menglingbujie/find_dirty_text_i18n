#!/bin/sh
echo `grep -r "$1" "$2" | grep -v vjs`
