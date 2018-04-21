#!/bin/bash
if ! $FACETCHECK_DEV; then
  set -e
fi
#print statements as they are executed
[[ -n $DEBUG_ENTRYPOINT ]] && set -x
source ${FACETCHECK_RUNTIME_DIR}/functions

map_uidgid

case ${1} in
  app:start|app:dev)



    case ${1} in
      app:start)
        npm run build;
        npm run start;
        ;;
      app:dev)
        npm run dev
        ;;
    esac
    ;;
  app:help)
    echo "Available options:"
    echo " app:start        - Starts the facetcheck server (default)"
    echo " app:dev          - Starts the facetcheck server, and watches for any file changes"
    echo " app:help         - Displays the help"
    echo " [command]        - Execute the specified command, eg. bash."
    ;;
  *)
    exec "$@"
    ;;
esac

exit 0
