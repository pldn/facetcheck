FROM triply/ubuntu:20180228
ARG BASENAME
ARG SSH_PRIVATE_KEY=''
ARG BUILD_DATE

MAINTAINER laurens.rietveld@triply.cc
ENV FACETCHECK_CACHE_DIR="/etc/docker-facetcheck" \
    FACETCHECK_USER="facetcheck" \
    HOME_DIR="/home/facetcheck"
ENV FACETCHECK_BUILD_DIR="${FACETCHECK_CACHE_DIR}/build" \
    FACETCHECK_RUNTIME_DIR="${FACETCHECK_CACHE_DIR}/runtime" \
    FACETCHECK__NODE_DIR=${HOME_DIR}/node

COPY ./docker/assets/build ${FACETCHECK_BUILD_DIR}
EXPOSE 5000
RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
 && echo "deb-src https://deb.nodesource.com/node_8.x ${DIST} main" >> /etc/apt/sources.list.d/nodesource.list \
 && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 \
 && echo "deb https://deb.nodesource.com/node_8.x ${DIST} main" > /etc/apt/sources.list.d/nodesource.list \
 && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y rsync nodejs \
 && npm install npm -g \
 && apt-get clean
ENTRYPOINT ["/sbin/entrypoint.sh"]
CMD ["app:start"]

COPY ./docker/assets/runtime ${FACETCHECK_RUNTIME_DIR}
COPY ./docker/entrypoint.sh  /sbin/entrypoint.sh

RUN chmod 755 /sbin/entrypoint.sh

COPY . ${FACETCHECK__NODE_DIR}
RUN bash ${FACETCHECK_BUILD_DIR}/install.sh
WORKDIR ${FACETCHECK__NODE_DIR}
