#!/bin/bash


docker-machine use -u;
docker-compose build;
docker-compose push;
docker-machine use lod;
docker-compose pull;
docker-compose up -d;
docker-compose logs -f
