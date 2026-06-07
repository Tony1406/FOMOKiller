# Guia de despliegue de FOMOKiller

Esta guia cubre como levantar el proyecto en local para desarrollo, como
desplegarlo en produccion (tu servidor casero o cualquier VPS), como ponerlo
detras de un nginx reverse proxy y como actualizarlo sin romper datos.

---

## Indice

1. [Requisitos previos](#requisitos-previos)
2. [Estructura del proyecto en docker](#estructura-del-proyecto-en-docker)
3. [Variables de entorno](#variables-de-entorno)
4. [Modo desarrollo (hot reload)](#modo-desarrollo-hot-reload)
5. [Modo produccion](#modo-produccion)
6. [Despliegue en servidor casero detras de nginx](#despliegue-en-servidor-casero-detras-de-nginx)
7. [Actualizar el proyecto](#actualizar-el-proyecto)
8. [Backups y restore de la base de datos](#backups-y-restore-de-la-base-de-datos)
9. [Operaciones comunes](#operaciones-comunes)
10. [Troubleshooting](#troubleshooting)

---

## Requisitos previos

En la maquina donde corra el proyecto necesitas:

- **Docker Engine** 24+ (con plugin `docker compose` v2).
- **Git** para clonar y actualizar.
- Puertos libres segun el modo:
  - Desarrollo: `5173` (cliente), `3000` (server), `3307` (MySQL hacia host).
  - Produccion: solo `8080` (o el que configures con `CLIENT_PORT`).

Comprueba que docker esta:

```bash
docker version
docker compose version
```

---

## Estructura del proyecto en docker

Tres servicios en una red privada `fomonet`:

```
                                                  Internet / LAN
                                                        |
                                                        v
                                             +---------------------+
                                             |  nginx publico      |  (opcional, tu
                                             |  (reverse proxy)    |   servidor casero)
                                             +----------+----------+
                                                        |
                                                        v  host:CLIENT_PORT (default 8080)
   +--------------+        +--------------+      +-------------+
   |   db         | <----- |   server     | <--- |   client    |
   |   MySQL 8    |        |   Node 22    |      |   nginx     |
   |   (interno)  |        |   (interno)  |      |   (publico) |
   +--------------+        +--------------+      +-------------+
        ^                      ^                       |
        |  init.sql            | /api/health           | /api/  proxypass
        |  volume db_data      |                       v
                                                  server:3000
```

- El **cliente** (nginx con el bundle de Vite) es el unico que expone puerto al
  host. Sirve el SPA y proxifica `/api/` al `server` por la red interna de
  docker.
- El **server** no expone puertos al host en produccion. Solo se le llega desde
  el cliente o desde dentro de la red `fomonet`.
- La **base de datos** tampoco expone puertos en produccion. Tu cliente nginx no
  la necesita, y el server la alcanza por DNS interno (`db:3306`).

En **desarrollo** se exponen los tres puertos al host para poder depurar
directamente.

---

## Variables de entorno

Toda la configuracion sensible va en `.env` en la raiz del repo. Copia el
ejemplo y rellena los valores:

```bash
cp .env.example .env
```

Variables:

| Variable                  | Para que sirve                                                | Obligatoria |
|---------------------------|----------------------------------------------------------------|-------------|
| `MYSQL_ROOT_PASSWORD`     | Contrasena root de MySQL                                       | si          |
| `MYSQL_DATABASE`          | Nombre de la base (default `fomokiller`)                       | no          |
| `MYSQL_USER`              | Usuario aplicativo                                             | no          |
| `MYSQL_PASSWORD`          | Contrasena del usuario aplicativo                              | si          |
| `DB_PORT_HOST`            | Puerto del host que mapea a MySQL en dev (default `3307`)      | no          |
| `JWT_SECRET`              | Secreto para firmar tokens JWT (cambialo, largo y aleatorio)   | si          |
| `CLIENT_URL`              | Origen permitido por CORS. Acepta varios separados por coma    | si          |
| `RAWG_API_KEY`            | API key de RAWG para importar juegos                           | no          |
| `YOUTUBE_API_KEY`         | API key de YouTube para trailers                               | no          |
| `CLOUDINARY_CLOUD_NAME`   | Subida de avatares a Cloudinary                                | no          |
| `CLOUDINARY_API_KEY`      | Idem                                                            | no          |
| `CLOUDINARY_API_SECRET`   | Idem                                                            | no          |
| `CLIENT_PORT`             | Puerto del host donde se publica el nginx del cliente (prod)   | no          |
| `VITE_API_URL`            | URL del API que se hornea en el bundle del cliente             | no          |

> **Importante:** `JWT_SECRET`, `MYSQL_ROOT_PASSWORD` y `MYSQL_PASSWORD` son
> requeridos por `docker compose` (la sintaxis `${VAR:?}` falla si no estan).

`CLIENT_URL` para CORS:
- En local sin docker: `http://localhost:5173`
- En docker dev: `http://localhost:5173`
- En docker prod en local: `http://localhost:8080`
- En servidor casero con dominio: `https://tudominio.com`
- Multiples a la vez: `https://tudominio.com,https://www.tudominio.com`

---

## Modo desarrollo (hot reload)

Levanta el stack en modo dev con volumenes montados, nodemon en el server y
Vite dev server en el cliente:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Que obtienes:

- Cliente en `http://localhost:5173`. Vite hace hot reload al editar `Client/src/`.
- Server en `http://localhost:3000`. Nodemon reinicia al editar `Server/src/`.
- MySQL accesible desde el host en `localhost:3307` (usuario/pwd del `.env`).
- Las llamadas a `/api` del cliente las proxifica Vite al server por la red
  interna de docker (no hay CORS).

Parar:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Anadir `-v` borra el volumen de MySQL (reinicia la base).

### Crear un alias para no repetir flags

```bash
alias fk-dev='docker compose -f docker-compose.yml -f docker-compose.dev.yml'
fk-dev up --build
fk-dev logs -f server
fk-dev down
```

### Ejecutar scripts del server dentro del contenedor

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec server npm run create:admin
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec server npm run import:rawg
```

### Notas

- Los `node_modules` del host **no** se montan dentro del contenedor (hay un
  volumen anonimo encima). Si anades una dependencia con `npm install`, hazlo
  desde **dentro** del contenedor o rebuildea la imagen:
  ```bash
  fk-dev exec server npm install <paquete>
  # o
  fk-dev build server
  ```
- Si en Mac/Windows el hot reload no detecta cambios, comprueba que las
  variables `CHOKIDAR_USEPOLLING` y `WATCHPACK_POLLING` siguen a `true` en el
  override.

---

## Modo produccion

```bash
docker compose up -d --build
```

Que ocurre:

1. Se construye el server con TypeScript compilado a `dist/` y se corre como
   usuario no-root.
2. Se construye el cliente con `vite build` y se sirve con nginx alpine.
3. Solo el nginx del cliente expone puerto al host (`8080` por defecto).
4. El nginx del cliente proxifica todo lo que llegue a `/api/` al server por
   la red interna.

Verificar que esta vivo:

```bash
docker compose ps
curl http://localhost:8080/api/health
curl http://localhost:8080/healthz
```

Ambos endpoints deben devolver `200`. Si ves `(healthy)` en `docker compose ps`
es que los healthchecks internos tambien pasan.

Logs en vivo:

```bash
docker compose logs -f
docker compose logs -f server
docker compose logs -f client
```

Parar sin perder datos:

```bash
docker compose down
```

Parar **y borrar la base de datos** (cuidado):

```bash
docker compose down -v
```

---

## Despliegue en servidor casero detras de nginx

Aqui el patron tipico: tu servidor tiene un nginx publico (o Caddy, Traefik,
nginx-proxy-manager...) que termina TLS y enruta dominios a contenedores
internos. FOMOKiller solo expone su puerto local `8080` al servidor, no a
internet.

### 1. Clonar y configurar

```bash
ssh tu-servidor
sudo mkdir -p /opt && cd /opt
git clone <repo> fomokiller
cd fomokiller
cp .env.example .env
nano .env       # cambia todos los valores marcados como CAMBIAR_
```

El `.env.example` esta organizado por secciones y solo necesitas tocar lo que
ponga `CAMBIAR_` (pwds, `JWT_SECRET`, `CLIENT_URL` con tu dominio). Deja
`HOST_BIND=127.0.0.1` para que el contenedor solo sea accesible desde el propio
host (y por tanto solo a traves de tu nginx publico).

> `VITE_API_URL=/api` es lo correcto cuando todo va por el mismo dominio. El
> bundle del cliente hara fetch a rutas relativas y tu nginx publico las
> reenviara al nginx del contenedor, que a su vez las proxifica al server.

### 2. Arrancar

Con el script de deploy:

```bash
./deploy/deploy.sh
```

(O a mano: `docker compose up -d --build`.)

### 3. Configurar el nginx publico

Hay un sample listo en `deploy/nginx-fomokiller.conf`. Copialo a sites-available
y cambia el dominio + las rutas del certificado:

```bash
sudo cp deploy/nginx-fomokiller.conf /etc/nginx/sites-available/fomokiller.conf
sudo nano /etc/nginx/sites-available/fomokiller.conf
sudo ln -s /etc/nginx/sites-available/fomokiller.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

El sample ya incluye:
- Redireccion HTTP -> HTTPS.
- TLS 1.2/1.3 con cifrados modernos y OCSP stapling.
- Cabeceras de seguridad (HSTS, X-Frame-Options, etc).
- Soporte para websockets (preparado para futuras features).
- Limite de body de 10M (suficiente para subida de avatares).

### 4. Certificado TLS con certbot

```bash
sudo certbot --nginx -d fomokiller.tudominio.com
```

Certbot detectara el bloque server del paso anterior y emitira/renovara el
certificado automaticamente.

### 4. Cookies y HTTPS

Si en algun momento el server emite cookies, asegurate que se marcan como
`Secure` y `SameSite=None` (o `Lax` segun el caso) cuando se sirve por HTTPS, y
que el server confia en el proxy:
- En el server, ya hay `credentials: true` en CORS y se lee `CLIENT_URL`. Pon
  ahi tu dominio publico **con esquema** (`https://...`).
- Si necesitas que express respete `X-Forwarded-Proto` para generar URLs o
  cookies seguras, anade `app.set('trust proxy', 1)` en `Server/src/index.ts`.

### 5. Arranque automatico al reiniciar el servidor

El `docker-compose.yml` ya usa `restart: unless-stopped` en los tres servicios.
Con que el daemon de docker arranque en el boot (lo hace por defecto en la
mayoria de distros), los contenedores volveran solos.

Comprobar:

```bash
systemctl is-enabled docker
sudo systemctl enable docker   # si saliera disabled
```

---

## Actualizar el proyecto

### Actualizar a la ultima version del codigo

Desde la raiz del proyecto en el servidor:

```bash
./deploy/deploy.sh
```

O a mano:

```bash
git pull
docker compose up -d --build
```

`up -d --build` reconstruye solo las imagenes cuyo contexto haya cambiado y
recrea los contenedores afectados. La base de datos **no se toca** (el volumen
`db_data` persiste).

### Actualizar solo un servicio

```bash
docker compose up -d --build server
docker compose up -d --build client
```

### Aplicar cambios de variables de entorno

Si solo editas `.env`:

```bash
docker compose up -d
```

(Docker recreara los contenedores que dependen de variables modificadas.)

### Actualizar la imagen base de MySQL o nginx

Si quieres tirar de las ultimas releases parcheadas:

```bash
docker compose pull
docker compose up -d
```

### Limpiar imagenes antiguas tras varios builds

Tras hacer varios rebuilds se acumulan capas huerfanas. Para reclamar espacio:

```bash
docker image prune -f
# o mas agresivo (cuidado, borra todo lo no usado por contenedores corriendo)
docker system prune -af
```

### Rollback rapido

Si una actualizacion rompe algo:

```bash
git log --oneline -n 10
git checkout <hash-anterior>
docker compose up -d --build
```

Para volver a la rama:

```bash
git checkout main
docker compose up -d --build
```

---

## Backups y restore de la base de datos

### Backup

Hay un script preparado en `deploy/backup-db.sh` que hace dump comprimido a
`deploy/backups/` y mantiene los 14 ultimos:

```bash
./deploy/backup-db.sh
```

Para automatizarlo a diario, anade al crontab:

```bash
crontab -e
# diario a las 3am:
0 3 * * * cd /opt/fomokiller && ./deploy/backup-db.sh >> /var/log/fomokiller-backup.log 2>&1
```

Tambien puedes copiar el volumen entero (mas pesado):

```bash
docker run --rm -v fomokiller_db_data:/data -v "$PWD/deploy/backups":/backup \
  alpine tar czf /backup/db_data_$(date +%Y%m%d_%H%M%S).tgz -C / data
```

### Restore

```bash
gunzip -c deploy/backups/fomokiller_XXXXXX.sql.gz | \
  docker compose exec -T db sh -c \
  'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"'
```

### Reset completo (borra todo)

```bash
docker compose down -v
docker compose up -d --build
```

Al arrancar de cero, MySQL volvera a ejecutar `db/init.sql`.

---

## Operaciones comunes

| Que quieres                         | Comando                                                    |
|-------------------------------------|-------------------------------------------------------------|
| Ver contenedores y su salud         | `docker compose ps`                                         |
| Logs de todo                        | `docker compose logs -f`                                    |
| Logs de un servicio                 | `docker compose logs -f server`                             |
| Entrar a una shell del server       | `docker compose exec server sh`                             |
| Entrar a MySQL                      | `docker compose exec db mysql -ufkuser -pfkpass fomokiller` |
| Reiniciar un servicio               | `docker compose restart server`                             |
| Crear un admin                      | `docker compose exec server node dist/scripts/createAdmin.js` |
| Importar juegos desde RAWG          | `docker compose exec server node dist/scripts/importFromRawg.js` |
| Inspeccionar variables del server   | `docker compose exec server env`                            |
| Ver uso de recursos                 | `docker stats`                                              |

> En produccion los scripts hay que llamarlos a la version compilada (`dist/`).
> En dev los puedes llamar como estan en `package.json`:
> `docker compose -f ... -f docker-compose.dev.yml exec server npm run create:admin`.

---

## Troubleshooting

### El cliente no puede llamar al API

1. Comprueba que `VITE_API_URL` esta bien horneado:
   ```bash
   docker compose exec client sh -c 'grep -o "VITE_API_URL[^\"]*" /usr/share/nginx/html/assets/index-*.js | head'
   ```
   Si no es el valor que esperas, rebuildea el cliente con
   `docker compose build --no-cache client && docker compose up -d client`.
2. Comprueba que el server responde dentro de la red:
   ```bash
   docker compose exec client wget -qO- http://server:3000/api/health
   ```

### El server no se conecta a la base

1. Mira los logs: `docker compose logs server | tail -50`.
2. Comprueba que el host es `db` (no `localhost`) y que `MYSQL_PASSWORD`
   coincide entre los dos servicios.
3. Si la base esta en `(healthy)` pero el server falla, suele ser un usuario
   mal creado. Reseteo limpio:
   ```bash
   docker compose down -v
   docker compose up -d --build
   ```

### Error de CORS desde el navegador

`CLIENT_URL` no incluye el origen desde el que estas accediendo. Anadelo
(separa varios por coma) y reinicia el server:

```bash
docker compose up -d server
```

### El puerto 8080 esta ocupado

Cambia `CLIENT_PORT` en `.env`:

```env
CLIENT_PORT=8090
```

```bash
docker compose up -d
```

### El healthcheck del server queda en `starting` para siempre

Mira los logs: probablemente el server esta crasheando antes de escuchar.
Causas tipicas:
- Variable obligatoria faltante (`JWT_SECRET`, credenciales de DB).
- La DB todavia no esta lista (no deberia pasar porque hay `depends_on`
  con `condition: service_healthy`, pero comprueba el log de `db`).

### Tras un `git pull` no veo los cambios

Falta el `--build`:

```bash
docker compose up -d --build
```

Si tampoco asi, fuerza sin cache:

```bash
docker compose build --no-cache
docker compose up -d
```

---

## Recordatorios de seguridad

- Cambia `JWT_SECRET`, `MYSQL_ROOT_PASSWORD` y `MYSQL_PASSWORD` antes de
  poner nada en internet.
- Nunca subas el `.env` al repo (ya esta en `.gitignore`).
- En produccion no expongas el puerto del server ni el de MySQL al host
  publico. Si necesitas administrar la base remotamente, hazlo por tunel
  SSH:
  ```bash
  ssh -L 3307:127.0.0.1:3307 usuario@tu-servidor
  # y temporalmente anade el mapeo de puerto a db en docker-compose.yml
  ```
- Mantente actualizado: `docker compose pull` mensualmente para imagenes
  base, y `npm audit` en `Server/` y `Client/` para dependencias.
