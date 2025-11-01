#!/bin/bash

#production
git reset --hard
git checkout master
git pull origin master

# Stop existing containers
docker compose down

# Build and start containers
docker compose up -d --build