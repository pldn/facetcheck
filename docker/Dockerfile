FROM node:8
ARG BASENAME
MAINTAINER laurens.rietveld@triply.cc
ENV FACETCHECK_CACHE_DIR="/etc/docker-facetcheck" \
    FACETCHECK_USER="facetcheck" \
    HOME_DIR="/home/facetcheck"
ENV FACETCHECK_BUILD_DIR="${FACETCHECK_CACHE_DIR}/build" \
    FACETCHECK_RUNTIME_DIR="${FACETCHECK_CACHE_DIR}/runtime" \
    FACETCHECK__NODE_DIR=${HOME_DIR}/node

COPY ./docker/assets/build ${FACETCHECK_BUILD_DIR}
EXPOSE 5000
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y rsync && apt-get clean
ENTRYPOINT ["/sbin/entrypoint.sh"]
CMD ["app:start"]

COPY ./docker/assets/runtime ${FACETCHECK_RUNTIME_DIR}
COPY ./docker/entrypoint.sh  /sbin/entrypoint.sh

RUN chmod 755 /sbin/entrypoint.sh

RUN bash ${FACETCHECK_BUILD_DIR}/install.sh
COPY . ${TRIPLY__NODE_DIR}
WORKDIR ${FACETCHECK__NODE_DIR}
