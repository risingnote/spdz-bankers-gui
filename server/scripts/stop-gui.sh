#!/bin/bash

HERE=$(cd `dirname $0`; pwd)
CLONEROOT=$HERE/..

for f in $CLONEROOT/logs/*.pid
do
  read pid <$f
  echo "Killing process $pid"
  kill $pid
done
