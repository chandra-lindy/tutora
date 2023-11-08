#!/bin/bash

sudo apt-get update
sudo apt-get install -y libmysqlclient-dev
pip3 install -r /home/ubuntu/tutora/backend/requirements.txt
