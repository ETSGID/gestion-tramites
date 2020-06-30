# App gestión de trámites ETSIT UPM

## Resumen
Aplicación para gestión de trámites en la ETSIT UPM.
Trámites gestionados por la app:
- Gestión de títulos

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
DB_HOST=dbtitulos
SERVICE=https://pruebas.etsit.upm.es #url servicio sin contexto
CAS=https://repo.etsit.upm.es/cas-upm #url servidor cas
SESSION_SECRET=Secreto_para_las_sesiones
CONTEXT1=/pas/gestion-titulos/
CONTEXT2=/estudiantes/gestion-titulos/
PORT=3000
DEV=false
PRUEBAS=false
DOCKER=true
EMAIL_HOST=smtp.etsit.upm.es
EMAIL_PORT=587
EMAIL_USER=zz.mailer.sys2
EMAIL_PASS=
EMAIL_SENDER=Solicitud título <noreply@etsit.upm.es>
EMAIL_SECRETARIA=secretaria.alumnos@etsit.upm.es #(usario de correo upm)
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
Se deben copiar las variables presentes en el fichero  `back/code/file.env` en el siguiente fichero `back/code/local.env`. Este fichero no se subirá al repositorio para proteger las credenciales del usuario. En este fichero se deben configurar las variables de entorno con contraseñas, ya que se encuentra en el `.gitignore`. Las variables de entorno son las siguientes:
```shell
POSTGRES_DB=gestion_tramites #(nombre de DB)
DB_USERNAME=postgres #(nombre de usuario de DB)
DB_PASSWORD=1234#(password de DB)
DB_HOST=localhost
SERVICE=http://localhost:3000
CAS=https://repo.etsit.upm.es/cas-upm
SESSION_SECRET=Secreto_para_las_sesiones
CONTEXT1=/pas/gestion-tramites/
CONTEXT2=/estudiantes/gestion-tramites/
PORT=3000
DEV=true#(entorno de desarrollo)
PRUEBAS=false#(entrono de pruebas host26 o 27)
DOCKER=false
EMAIL_HOST=smtp.upm.es
EMAIL_PORT=587
EMAIL_USER=xxxx@alumnos.upm.es#(usario de correo upm)
EMAIL_PASS=XXXX#(contraseña de correo upm)
EMAIL_SENDER=xxxx@alumnos.upm.es#(usario de correo upm)
EMAIL_SECRETARIA=xxxx@alumnos.upm.es#(usario de correo upm)
```
- Consideraciones:
	- En local no se pueden utilizar las apis externas, por lo que se usan maquetas de datos **(DEV=true)**
	- **(DEV=true)** no  pasa por el cas y crea un **usario inventado** (Fernando Fernández Fernández) con los roles (**FA**): PAS y Alumno 
	- En local no se puede usar la cuenta de correo ``zz.mailer.sys2``, pero sí se puede usar el correo de tipo @upm.es o @alumnos.upm.es con las credenciales del usuario.
	- Configuración de CAS y SERVICE sirve para cualquier aplicación en localhost:3000. Aunque si **DEV=true** no pasa por el CAS
	- Es necesario crear previamente la base de datos con los parámetros que se pasan (POSTGRES_DB, DB_USERNAME, DB_PASSWORD). La base de datos puede ser un contenedor docker o instalarla en el propio host. Se trata de una BBDD PostgreSQL.
##### Comandos necesarios
```shell
cd code/back
npm install #instala los paquetes
npm start
```

#### BBDD
Debe instalar **PostgreSQL** y crear la base de datos con el mismo password, username y nombre de la base de datos que se configuró en el local.env
Se recomienda instalar **pgAdmin**, una interfaz gráfica que permite manipular fácilmente la base de datos.
#### Front
Si se quiere probar / desarrollar el front de un trámite realizado con **React.js**,  debe arrancar el back para poder realizar peticiones. Debe iniciarse como se indica en el apartado anterior. Otra opción si aún no está desarrollada la parte de back del trámite es utilizar jsons para simular los datos.

##### Arrancar el servidor de Front para desarrollar
Ver [Front README.md](front/README.md)
