#!/bin/bash

docker rm -f $(docker ps -a -q --filter "name=website")

docker image rm -f $(docker images -q --filter "reference=website*")
