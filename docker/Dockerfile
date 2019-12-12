FROM triply/ubuntu:20191029-1
ARG SSH_PRIVATE_KEY=''
ARG BUILD_DATE

MAINTAINER laurens.rietveld@triply.cc
ENV FACETCHECK_CACHE_DIR="/etc/docker-facetcheck" \
    FACETCHECK_USER="facetcheck" \
    HOME_DIR="/home/facetcheck"
ENV FACETCHECK_BUILD_DIR="${FACETCHECK_CACHE_DIR}/build" \
    FACETCHECK_RUNTIME_DIR="${FACETCHECK_CACHE_DIR}/runtime" \
    FACETCHECK__NODE_DIR=${HOME_DIR}/node

LABEL com.centurylinklabs.watchtower.enable="true"
COPY ./docker/assets/build ${FACETCHECK_BUILD_DIR}
EXPOSE 5000
ENTRYPOINT ["/sbin/entrypoint.sh"]
CMD ["app:start"]

COPY ./docker/assets/runtime ${FACETCHECK_RUNTIME_DIR}
COPY ./docker/entrypoint.sh  /sbin/entrypoint.sh

RUN chmod 755 /sbin/entrypoint.sh

COPY . ${FACETCHECK__NODE_DIR}
RUN bash ${FACETCHECK_BUILD_DIR}/install.sh
WORKDIR ${FACETCHECK__NODE_DIR}
