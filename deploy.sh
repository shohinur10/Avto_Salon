#!/bin/bash
set -e  # Exit on any error

#production
git fetch origin
git clean -fd
git reset --hard origin/master
git checkout master

# Stop existing containers
docker compose down

# Build and start containers
docker compose build --no-cache
docker compose up -d