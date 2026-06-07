#!/usr/bin/env bash
# Despliegue / actualizacion de FOMOKiller en el servidor.
#
# Uso:
#   ./deploy/deploy.sh           # git pull + build + up
#   ./deploy/deploy.sh --no-pull # solo build + up (si ya hiciste pull a mano)
#   ./deploy/deploy.sh --pull-only
#
# Debe ejecutarse desde la raiz del repo.

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

DO_PULL=1
DO_DEPLOY=1

for arg in "$@"; do
    case "$arg" in
        --no-pull)    DO_PULL=0 ;;
        --pull-only)  DO_DEPLOY=0 ;;
        -h|--help)
            grep '^#' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "Opcion desconocida: $arg" >&2
            exit 1
            ;;
    esac
done

if [[ ! -f .env ]]; then
    echo "ERROR: falta .env en la raiz. Copia .env.example y editalo." >&2
    exit 1
fi

if (( DO_PULL )); then
    echo ">> git pull..."
    git pull --ff-only
fi

if (( DO_DEPLOY )); then
    echo ">> docker compose build..."
    docker compose build

    echo ">> docker compose up -d..."
    docker compose up -d

    echo ">> esperando a que los servicios pasen healthcheck..."
    sleep 5
    docker compose ps

    echo
    echo ">> ultimos logs del server:"
    docker compose logs --tail 20 server || true

    echo
    echo ">> deploy terminado. Comprueba en el navegador o con:"
    echo "   curl -I https://tu-dominio/"
fi
