#!/bin/sh

VERSION=$(echo "$CIRCLE_SHA1" | cut -c -7)

YQ_SCRIPT="env_variables.REDIS_DB: $REDIS_DB
env_variables.REDIS_HOST: $REDIS_HOST
env_variables.REDIS_PASSWORD: $REDIS_PASSWORD
env_variables.REDIS_PORT: $REDIS_PORT"

echo "$YQ_SCRIPT" > app.deploy.script.yaml

yq write --script app.deploy.script.yaml app.yaml > app.deploy.yaml

gcloud app deploy app.deploy.yaml cron.yaml --version="$VERSION"
