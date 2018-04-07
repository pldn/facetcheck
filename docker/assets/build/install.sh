#!/bin/bash
#exit on any error
set -e

adduser --disabled-login --gecos 'Facetcheck' "${FACETCHECK_USER}"
passwd -d "${FACETCHECK_USER}"



# make sure everything in "${FACETCHECK_HOME}" is owned by the facetcheck user
chown -R "${FACETCHECK_USER}":"${FACETCHECK_USER}" "${FACETCHECK_HOME}"/
