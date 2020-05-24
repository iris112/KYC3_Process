#! /bin/bash

mvn clean package && \
docker build -t ico-kyc-tool .
