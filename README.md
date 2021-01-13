# App gestión de trámites ETSIT UPM

## Resumen
Aplicación para gestión de trámites en la ETSIT UPM.
Trámites gestionados por la app:
- Gestión de títulos
- Gestión de certificados
- Evaluación curricular

El proyecto se separa en dos partes:

**1. Back**
- Contiene la lógica de la aplicación y la conexión con la base de datos.
- Módulos comunes para todos los trámites y específicos para cada uno.

**2. Front**
- Contiene parte front de cada trámite.
- La app es un conjunto de SPAs (Single Page App), en la que cada trámite es una SPA.
- Los **.js** generados se guardan en la parte public de **back**
## Tecnologías y versiones a instalar
1. Sin docker
	- Node.js (versión ...)
	- npm (versión ...)
	- PostgreSQL (versión ...)
1. Con Docker
	- Docker
	- Docker-compose

- Otras tecnologías (se instalan mediante npm, definidos en el package.json)
	- Back
		- Express.js
		- Sequelize ORM
	- Front
		- React.js
		- Webpack

## Puesta en marcha
### Producción / pruebas
##### Variables de entorno
###### gestion-tramites.env
```shell
POSTGRES_DB=gestion_tramites #(nombre de DB)
DB_USERNAME=postgres #(nombre de DB)
DB_PASSWORD=1234
DB_HOST=dbtramites
DB_PORT=5432
SERVICE=https://pruebas.etsit.upm.es #url servicio sin contexto
CAS=https://siupruebas.upm.es/cas #url nuevo servidor cas
SESSION_SECRET=Secreto_para_las_sesiones
CONTEXT1=/pas/gestion-tramites/
CONTEXT2=/estudiantes/gestion-tramites/
PORT=3000
DEV=false
PRUEBAS=false # true en pruebas
DOCKER=true
EMAIL_HOST=smtp.etsit.upm.es
EMAIL_PORT=587
EMAIL_USER=zz.mailer.sys2
EMAIL_SENDER=Solicitud trámite <noreply@etsit.upm.es> 
EMAIL_SECRETARIA=secretaria.alumnos@etsit.upm.es
EMAIL_PRUEBAS=xxx@alumnos.upm.es #(solo para pruebas, a donde envia el mail de los alumnos)
EMAIL_PASS= #contraseña de zz.mailer.sys2
EMAIL_ADMIN= #email del encargado de gestionar permisos, como por ejemplo secretario.etsit@upm.es
API_UPM_HORARIO_PASSPHRASE= # passphrase de api upm
API_EVAL_CURRICULAR_USERNAME= # usuario api ev. curricular
API_EVAL_CURRICULAR_PWD= # contraseña api ev. curricular
API_EVAL_CURRICULAR_URL=https://api.etsit.upm.es/stats/report/evaluacion_curricular
```
###### gestion-tramites-db.env 
```shell
POSTGRES_DB=gestion_tramites
POSTGRES_USER=postgres
POSTGRES_PASSWORD=XXXX
```
##### Comandos necesarios
- Imagen:
```shell
git.etsit.upm.es:4567/grupointegraciondigital/gestion-tramites:stable
```
- Configuración de docker-compose.override.yml
- Ejecución:
```shell
docker-compose up
```

### Local (sin Docker)
#### Back
##### Variables de entorno
Se deben copiar las variables presentes en el fichero  `back/file.env` en el siguiente fichero `back/local.env`. Este fichero no se subirá al repositorio para proteger las credenciales del usuario. En este fichero se deben configurar las variables de entorno con contraseñas, ya que se encuentra en el `.gitignore`. Las variables de entorno son las siguientes:
```shell
POSTGRES_DB=gestion_tramites #(nombre de DB)
DB_USERNAME=postgres #(nombre de usuario de DB)
DB_PASSWORD=1234 #(password de DB)
DB_HOST=localhost
DB_PORT=5432
SERVICE=http://localhost:3000
CAS=ttps://siupruebas.upm.es/cas
SESSION_SECRET=Secreto_para_las_sesiones
CONTEXT1=/pas/gestion-tramites/
CONTEXT2=/estudiantes/gestion-tramites/
PORT=3000
DEV=true #(entorno de desarrollo)
PRUEBAS=false #(entrono de pruebas host26 o 27)
DOCKER=false
EMAIL_HOST=smtp.upm.es
EMAIL_PORT=587
EMAIL_USER=zz.mailer.sys2
EMAIL_SENDER=Solicitud trámite <noreply@etsit.upm.es> 
EMAIL_SECRETARIA=secretaria.alumnos@etsit.upm.es
EMAIL_PRUEBAS=xxx@alumnos.upm.es #(solo para pruebas, a donde envia el mail de los alumnos)
EMAIL_PASS= #contraseña del alumno (del email de pruebas) para enviar los mails
EMAIL_ADMIN= #email del encargado de gestionar permisos, como por ejemplo secretario.etsit@upm.es
API_UPM_HORARIO_PASSPHRASE= # passphrase de api upm
API_EVAL_CURRICULAR_USERNAME= # usuario api ev. curricular
API_EVAL_CURRICULAR_PWD= # contraseña api ev. curricular
API_EVAL_CURRICULAR_URL=https://api.etsit.upm.es/stats/report/evaluacion_curricular
```
- Consideraciones:
	- En local no se pueden utilizar las apis externas, por lo que se usan maquetas de datos **(DEV=true)**
	- **(DEV=true)** no  pasa por el cas y crea un **usario inventado** (Fernando Fernández Fernández) con los roles (**FA**): PAS y Alumno 
	- En local no se puede usar la cuenta de correo ``zz.mailer.sys2``, pero sí se puede usar el correo de tipo @upm.es o @alumnos.upm.es con las credenciales del usuario.
	- Configuración de CAS y SERVICE sirve para cualquier aplicación en localhost:3000. Aunque si **DEV=true** no pasa por el CAS
	- Es necesario crear previamente la base de datos con los parámetros que se pasan (POSTGRES_DB, DB_USERNAME, DB_PASSWORD). La base de datos puede ser un contenedor docker o instalarla en el propio host. Se trata de una BBDD PostgreSQL.
	- El email de pruebas (EMAIL_PRUEBAS) se utiliza para indicar el destinatario y quien envía el email en pruebas. En local se debe indicar la contraseña del email del alumno que desea probar el servicio. En el entorno de pruebas la contraseña no es necesaria, solamente el email para indicar el destinatario, puesto que el que envía es ``zz.mailer.sys2`` (noreply@etsit.upm.es)
	- Para las peticiones a API UPM, el certificado y su clave privada se colocan desde la máquina anfitrión mapeando un volumen en app/certificates (o bien se colocan en esa carpeta directamente para su ejecución en local sin Docker).
##### Comandos necesarios
```shell
cd back
npm install #instala los paquetes"
npm run migrations #si se desean correr las migraciones de la bbdd
npm run seeders #si se desean correr los seeders de la bbdd
npm start
```

#### BBDD
Debe instalar **PostgreSQL** y crear la base de datos con el mismo password, username y nombre de la base de datos que se configuró en el local.env
Se recomienda instalar **pgAdmin**, una interfaz gráfica que permite manipular fácilmente la base de datos.

##### Ejecutar migraciones
Para realizar cambios en la base de datos deben hacerse a través de migraciones. Puede ejecutar todas las migracines con el siguiente comando:

```shell
cd back
# la url debe ser la de la base de datos

# ejemplo con variables de entorno
node_modules/.bin/sequelize db:migrate --url postgres://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$POSTGRES_DB

# ejemplo sin variables de entorno
node_modules/.bin/sequelize db:migrate --url postgres://postgres:1234@localhost:5432/gestion_tramites
```
Para deshacer las migraciones:
```shell
cd back
# la url debe ser la de la base de datos

# ejemplo con variables de entorno
node_modules/.bin/sequelize db:migrate:undo --url postgres://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$POSTGRES_DB

# ejemplo sin variables de entorno
node_modules/.bin/sequelize db:migrate:undo --url postgres://postgres:1234@localhost:5432/gestion_tramites
```

Para deshacer una migración determinada
```shell
cd back
# la url debe ser la de la base de datos

# ejemplo con variables de entorno
node_modules/.bin/sequelize db:migrate:undo --name exampleNameMigration --url postgres://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$POSTGRES_DB

# ejemplo sin variables de entorno
node_modules/.bin/sequelize db:migrate:undo --name exampleNameMigration --url postgres://postgres:1234@localhost:5432/gestion_tramites
```

#### Front
Si se quiere probar / desarrollar el front de un trámite realizado con **React.js**,  debe arrancar el back para poder realizar peticiones. Debe iniciarse como se indica en el apartado anterior. Otra opción si aún no está desarrollada la parte de back del trámite es utilizar jsons para simular los datos.

##### Arrancar el servidor de Front para desarrollar
Ver [Front README.md](front/README.md)


### Trámites
**1. Gestión Títulos**
https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/home

**2. Gestión Certificados**
https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Solicitud-de-certificados

**3. Evaluación Curricular**
https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Solicitud-de-evaluaci%C3%B3n-curricular
