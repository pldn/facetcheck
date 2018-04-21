#!/bin/bash
#exit on any error
set -e
adduser --disabled-login --gecos 'Facetcheck' "${FACETCHECK_USER}"
passwd -d "${FACETCHECK_USER}"

cd ${FACETCHECK__NODE_DIR} && npm install;

# make sure everything in "${HOME_DIR}" is owned by the facetcheck user
chown -R "${FACETCHECK_USER}":"${FACETCHECK_USER}" "${HOME_DIR}"/
