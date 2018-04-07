FROM node:8
ARG BASENAME
MAINTAINER laurens.rietveld@triply.cc
ENV FACETCHECK_CACHE_DIR="/etc/docker-facetcheck" \
    FACETCHECK_LOCAL_DOCKER_ASSETS="docker" \
    FACETCHECK_USER = "facetcheck" \
    HOME_DIR="/home/facetcheck"
ENV FACETCHECK_BUILD_DIR="${FACETCHECK_CACHE_DIR}/build" \
    FACETCHECK_RUNTIME_DIR="${FACETCHECK_CACHE_DIR}/runtime" \
COPY ${FACETCHECK_LOCAL_DOCKER_ASSETS}/assets/build ${FACETCHECK_BUILD_DIR}
EXPOSE 5000
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y rsync && apt-get clean
RUN bash ${FACETCHECK_BUILD_DIR}/install.sh

COPY ${FACETCHECK_LOCAL_DOCKER_ASSETS}/assets/runtime ${FACETCHECK_RUNTIME_DIR}
COPY ${FACETCHECK_LOCAL_DOCKER_ASSETS}/entrypoint.sh  /sbin/entrypoint.sh
RUN chmod 755 /sbin/entrypoint.sh
ENTRYPOINT ["/sbin/entrypoint.sh"]
CMD ["app:start"]

WORKDIR ${HOME_DIR}
RUN adduser --disabled-login --gecos 'FacetCheck' "${FACETCHECK_USER}" && passwd -d "${FACETCHECK_USER}"
