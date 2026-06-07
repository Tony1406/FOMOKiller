#!/usr/bin/env bash
# Dump de la base de datos a deploy/backups/.
# Programalo via cron para backups periodicos, por ejemplo cada noche a las 3:
#
#   0 3 * * * cd /opt/fomokiller && ./deploy/backup-db.sh >/dev/null 2>&1

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

BACKUP_DIR="deploy/backups"
mkdir -p "$BACKUP_DIR"

STAMP="$(date +%Y%m%d_%H%M%S)"
OUT="$BACKUP_DIR/fomokiller_${STAMP}.sql.gz"

docker compose exec -T db sh -c \
    'mysqldump --single-transaction --quick --routines --triggers \
               -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' \
    | gzip > "$OUT"

echo "Backup creado: $OUT"

# Retencion: conservar solo los ultimos 14 backups.
ls -1t "$BACKUP_DIR"/fomokiller_*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
