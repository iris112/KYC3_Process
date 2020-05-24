#!/bin/bash

set -e

mvn clean package

docker-compose -f docker-compose.yml rm -s -f
docker-compose -f docker-compose.yml up --build
