#!/bin/bash
set -e  # Exit on any error

#production
git reset --hard
git clean -fd
git checkout master
git pull origin master

# Stop existing containers
docker compose down

# Build and start containers
docker compose build --no-cache
docker compose up -d