#!/bin/bash
set -e

eval $(docker-machine env -u)
docker-compose build;
docker-compose push;
eval $(docker-machine env lod)
docker-compose pull;
docker-compose up -d;
docker-compose logs -f
