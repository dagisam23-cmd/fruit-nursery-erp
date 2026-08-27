#!/bin/bash

# Backup PostgreSQL database
echo "📦 Starting database backup..."

BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/fruit_nursery_erp_$TIMESTAMP.sql"

docker-compose exec -T postgres pg_dump -U postgres fruit_nursery_erp > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database backed up to $BACKUP_FILE"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    echo "✅ Backup compressed: ${BACKUP_FILE}.gz"
else
    echo "❌ Backup failed"
    exit 1
fi

# Keep only last 7 backups
echo "🧹 Cleaning old backups..."
find "$BACKUP_DIR" -name "fruit_nursery_erp_*.sql.gz" -mtime +7 -delete
echo "✅ Old backups removed"
