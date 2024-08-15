#! /bin/bash

sudo docker run -i -v ./:/home/node/code:delegated -v /home/node/code/node_modules/ -p 3000:3000 node-dev