#!/bin/bash

apt-get update
apt-get install -y curl

# install docker
curl -fsSL https://get.docker.com | sh
# pull vbrowser image
docker pull howardc93/vbrowser
# install certbot
DEBIAN_FRONTEND=noninteractive apt-get install -y certbot
certbot certonly --standalone -n --email iilwy@omg.games --agree-tos -d docker1.churu.live
chmod -R 755 /etc/letsencrypt/live/
chmod -R 755 /etc/letsencrypt/archive/
