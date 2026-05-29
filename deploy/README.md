# deploy/

Ficheros utiles para desplegar y mantener FOMOKiller en un servidor.

| Fichero                  | Para que sirve                                                   |
|--------------------------|-------------------------------------------------------------------|
| `nginx-fomokiller.conf`  | Sample de bloque server para el nginx publico del host (TLS, proxy a `127.0.0.1:8080`, cabeceras de seguridad). |
| `deploy.sh`              | Actualiza el stack: `git pull` + `docker compose build` + `up -d`. |
| `backup-db.sh`           | Dump de MySQL a `deploy/backups/` con rotacion (14 ultimos).      |
| `backups/`               | Dumps generados. Ignorado por git.                                |

## Primer despliegue (resumen)

```bash
ssh tu-servidor
git clone <repo> /opt/fomokiller
cd /opt/fomokiller
cp .env.example .env
nano .env                           # rellena los CAMBIAR_*
./deploy/deploy.sh

# despues, copia el nginx sample a tu servidor
sudo cp deploy/nginx-fomokiller.conf /etc/nginx/sites-available/fomokiller.conf
sudo nano /etc/nginx/sites-available/fomokiller.conf   # cambia dominio y rutas de cert
sudo ln -s /etc/nginx/sites-available/fomokiller.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# certificado con certbot
sudo certbot --nginx -d fomokiller.tudominio.com
```

## Backups automaticos (cron)

```bash
crontab -e
# anade esta linea para backup diario a las 3am:
0 3 * * * cd /opt/fomokiller && ./deploy/backup-db.sh >> /var/log/fomokiller-backup.log 2>&1
```

Ver la [guia completa](../DEPLOYMENT.md) para mas detalles.
