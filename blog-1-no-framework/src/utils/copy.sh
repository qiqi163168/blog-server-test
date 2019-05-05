#!/bin/sh
cd /Users/apple/myWorkSpace/blog-server-test/blog-1-no-framework/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log