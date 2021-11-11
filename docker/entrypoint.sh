#!/bin/bash
if ! $FACETCHECK_DEV; then
  set -e
fi
#print statements as they are executed
[[ -n $DEBUG_ENTRYPOINT ]] && set -x
source ${FACETCHECK_RUNTIME_DIR}/functions

map_uidgid

case ${1} in
  app:start|app:dev|app:bundle)



    case ${1} in
      app:bundle)
        exec_as_facetcheck yarn run prod:build;
        rm -rf ./src/config/.bundle;
        exec_as_facetcheck cp -r ./build/assets/dist ./src/config/.bundle;
        ;;
      app:start)
        exec_as_facetcheck yar run prod:build;
        exec_as_facetcheck yarn run prod:start;
        ;;
      app:dev)
        exec_as_facetcheck yarn run dev
        ;;
    esac
    ;;
  app:help)
    echo "Available options:"
    echo " app:start        - Starts the facetcheck server (default)"
    echo " app:bundle       - Transpiles facetcheck and its config"
    echo " app:dev          - Starts the facetcheck server, and watches for any file changes"
    echo " app:help         - Displays the help"
    echo " [command]        - Execute the specified command, eg. bash."
    ;;
  *)
    exec "$@"
    ;;
esac

exit 0
