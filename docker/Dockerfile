FROM node:8
ARG BASENAME
ENV BASE_DIR="/facetcheck"
EXPOSE 5000
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y rsync && apt-get clean
WORKDIR ${BASE_DIR}
COPY . ${BASE_DIR}
RUN cd ${BASE_DIR} && npm install && npm rebuild node-sass --force && npm run build 
ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["run","start"]
