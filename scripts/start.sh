#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu"
APP_NAME="winner"

TIME_NOW=$(date +%c)

cd $PROJECT_ROOT

pm2 delete $APP_NAME
pm2 start npm --name $APP_NAME -- start

echo "$TIME_NOW > Deploy has been completed"