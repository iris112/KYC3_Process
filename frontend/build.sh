#! /bin/bash

docker build -t ico-kyc-tool-frontend .
docker run -it -p 4200:80 --net backend_default ico-kyc-tool-frontend