SHELL:=/bin/bash
NAME := "facetcheck"


RED='\033[0;31m'
NC='\033[0m' # No Color
all: build



build: stop
	@echo "`date`: Building container"
	@docker-compose build
	@echo "`date`: Build done"

up:
	@echo "Starting ${NAME} container. Access at http://${HOSTNAME}:5000"
	@docker-compose up -d

upProd:
	@echo "Starting ${NAME} container. Access at http://${HOSTNAME}:5000"
	@docker-compose -f docker-compose-prod.yml up -d

upSudo:
	@echo "Initializing container with no foreground triply process."
	@docker-compose run --rm --service-ports ${NAME} /bin/bash



bash:
	@docker exec -it -u triply `docker ps -q --filter 'name=docker_facetcheck*' |  xargs --no-run-if-empty docker inspect --format '{{ .Name }}' | tail -c +2` bash

sudo:
	@docker exec -it `docker ps -q --filter 'name=docker_facetcheck*' |  xargs --no-run-if-empty docker inspect --format '{{ .Name }}' | tail -c +2` bash
restart:
	@docker-compose restart ${NAME}

stop:
	@echo "Stopping ${NAME}..."
	@docker-compose stop
	@docker-compose -f docker-compose-prod.yml stop

logs:
	@docker-compose logs -ft facetcheck
logsProd:
	@docker-compose -f docker-compose-prod.yml logs -f facetcheck
