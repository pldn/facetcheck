FROM node
ARG BASENAME
EXPOSE 5000
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y rsync && apt-get clean
WORKDIR ${BASE_DIR}
COPY . ${BASE_DIR}
RUN cd ${BASE_DIR} && npm install && npm run build
ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["run","start"]
