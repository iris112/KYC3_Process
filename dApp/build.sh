#! /bin/bash

docker build -t ico-kyc-token-backend .
sudo docker run -it -p 3001:3001 --rm --name tokentool --net backend_default ico-kyc-token-backend