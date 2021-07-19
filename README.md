# App gestión de trámites ETSIT UPM
[[_TOC_]]


## Descripción
- Aplicación para gestión de trámites en la ETSIT UPM.
- Gestor de permisos para el contexto PAS
- Trámites gestionados por la app:

 [1. Gestión de título](https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Trámites/Gesti%C3%B3n-de-t%C3%ADtulo)

 [2. Solicitud de certificados](https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Trámites/Solicitud-de-certificados)

 [3. Solicitud de evaluación curricular](https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Trámites/Solicitud-de-evaluaci%C3%B3n-curricular)


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
	- Node.js (versión 12.16.2)
	- npm (versión 6.14.4)
	- PostgreSQL (versión 9.6)
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


## Consideraciones previas
En la [Wiki general](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/home) de los proyectos se incluye alguna información de utilidad:
- Mapeo de puertos proxy inverso de la ETSIT: [Entorno de desarrollo, pruebas, producción y local](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Entorno-de-desarrollo,-pruebas,-producci%C3%B3n-y-local).
- Servicios y servidor CAS: [Entorno de desarrollo, pruebas, producción y local](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Entorno-de-desarrollo,-pruebas,-producci%C3%B3n-y-local).
- Conexión con el servidor CAS: [CAS, Central Authentication Service](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/CAS,-Central-Authentication-Service).
- Campos devueltos por el CAS: [CAS, Central Authentication Service](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/CAS,-Central-Authentication-Service).

## Puesta en marcha
### Consideraciones previas
La variable de entorno EMAIL_ADMIN solo se usa la primera vez que arranca el código para crear el rol **admin** a través de un seeder.

### Producción
##### Variables de entorno
Se deben usar las variables presentes en el fichero `gestion-tramites.env`, rellenando los campos vacíos que se corresponden con credenciales.
###### gestion-tramites.env
```shell
POSTGRES_DB=gestion_tramites #(nombre de DB)
DB_USERNAME=postgres #(nombre de DB)
DB_PASSWORD=1234
DB_HOST=dbtramites
DB_PORT=5432
SERVICE=https://portal.etsit.upm.es #url servicio sin contexto
CAS=https://siu.upm.es/cas #url nuevo servidor cas
SESSION_SECRET=Secreto_para_las_sesiones
CONTEXT1=/pas/gestion-tramites/
CONTEXT2=/estudiantes/gestion-tramites/
PORT=3000
DEV=false
PRUEBAS=false
DOCKER=true
EMAIL_HOST=smtp.etsit.upm.es
EMAIL_PORT=587
EMAIL_USER=zz.mailer.sys2
EMAIL_SENDER=Solicitud trámite <noreply@etsit.upm.es> 
EMAIL_SECRETARIA=secretaria.alumnos@etsit.upm.es 
EMAIL_PASS= #contraseña de zz.mailer.sys2
EMAIL_ADMIN= #email del encargado de gestionar permisos, como por ejemplo secretario.etsit@upm.es
API_UPM_HORARIO_PASSPHRASE= #passhprase de apiupm mihorario
API_EVAL_CURRICULAR_USERNAME= # usuario api ev. curricular
API_EVAL_CURRICULAR_PWD= # contraseña api ev. curricular
API_EVAL_CURRICULAR_URL=https://api.etsit.upm.es/stats/report/evaluacion_curricular
API_PERON_URL=https://legacy.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php
API_ETSIT_UPM_URL=https://api.etsit.upm.es/upm/public
```
###### gestion-tramites-db.env 
```shell
POSTGRES_DB=gestion_tramites
POSTGRES_USER=postgres
POSTGRES_PASSWORD=XXXX
```
##### Conexión servicios remotos
###### Servidor mail:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/EMAIL-UPM)
- Host: `smtp.etsit.upm.es` *(variable de  entorno)*
- Port : 587 *(variable de  entorno)*
- User : `zz.mailer.sys2` *(variable de  entorno)*
- Sender: `Solicitud trámite <noreply@etsit.upm.es>` *(variable de  entorno)*
- Password: Consultar GID o GICO *(variable de  entorno)*

###### API UPM datos públicos planes:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-UPM#servicios-p%C3%BAblicos)
 - No hace falta autenticación 
- URL:  `https://www.upm.es/wapi_upm/academico/comun/index.upm/v2/` *(peticiones in code)*

###### API UPM datos privados matricula (no usado actualmente por un fallo pero sí en el futuro):
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-UPM#informaci%C3%B3n-de-matr%C3%ADcula-de-un-alumno)
- PassPhrase:  Consultar GID o GICO *(variable de  entorno)*
- Certificados: Montar un volumen definido en ``docker-composoe.override.yml`` que mapee internamente a ``/app/certificates`` resultando en los certificados:
 - `/app/certificates/es_upm_etsit_mihorario_key.pem`
 - `/app/certificates/es_upm_etsit_mihorario_cert.pem`

###### API ETSIT UPM datos públicos planes:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-ETSIT-UPM)
- No hace falta autenticación 
- URL: `https://api.etsit.upm.es/upm/public`  *(variable de entorno)*

######  API Evaluación Curricular:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-EVALUACI%C3%93N-CURRICULAR)
- Username: Consultar GID o GICO*(variable de  entorno)*
- Password: Consultar GID o GICO *(variable de  entorno)*
- URL: `https://api.etsit.upm.es/stats/report/evaluacion_curricular` *(variable de  entorno)*

###### API PERON
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-PERON)
- URL: `https://legacy.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?uuid=` *(peticiones in code)*

###### CAS
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/CAS,-Central-Authentication-Service)
- Contextos:
 - `/pas/gestion-tramites/` *(variable de  entorno)*
 - `/estudiantes/gestion-tramites/`*(variable de  entorno)*
- Servidor: GICO
- Servicio: GICO

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

### Pruebas (host27)
##### Variables de entorno
Se deben copiar las variables presentes en el fichero  `back/pruebas.template.env` en el siguiente fichero `config/gestion-tramites/gestion-tramites.env`. Este fichero no se subirá al repositorio para proteger las credenciales. En este fichero se deben configurar las variables de entorno con contraseñas, ya que se encuentra en el `.gitignore`. Las variables de entorno son las siguientes:
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
PRUEBAS=true #para host27
DOCKER=true
EMAIL_HOST=smtp.etsit.upm.es
EMAIL_PORT=587
EMAIL_USER=zz.mailer.sys2
EMAIL_SENDER=Solicitud trámite <noreply@etsit.upm.es> 
EMAIL_PASS= #contraseña de zz.mailer.sys2
EMAIL_PRUEBAS=xxx@alumnos.upm.es #destino de los emails
EMAIL_ADMIN= #email del encargado de gestionar permisos, como por ejemplo secretario.etsit@upm.es
EMAIL_API=xxx@alumnos.upm.es #para probar APIs con email
UUID_API= yyy@upm.es #para probar APIs con UUID devuelto por el CAS
API_UPM_HORARIO_PASSPHRASE= #passhprase de apiupm mihorario
API_EVAL_CURRICULAR_USERNAME= # usuario api ev. curricular
API_EVAL_CURRICULAR_PWD= # contraseña api ev. curricular
API_EVAL_CURRICULAR_URL=https://api.etsit.upm.es/stats/report/evaluacion_curricular
API_PERON_URL=https://legacy.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php
API_ETSIT_UPM_URL=https://api.etsit.upm.es/upm/public
```
###### gestion-tramites-db.env 
```shell
POSTGRES_DB=gestion_tramites
POSTGRES_USER=postgres
POSTGRES_PASSWORD=XXXX
```
- Consideraciones:
	- Para logearse en el CAS se debe utilizar una de las cuentas de prueba, pero luego el usuario de la sesión será el que se indique en EMAIL_API
	- En el contexto PAS, es necesario dar permisos al usuario (EMAIL_API) para el trámite en cuestión, por lo que se debe añadir un permiso a mano en la base de datos, siendo el trámite 'admin','evaluacion-curricular','gestion-certificados' u otro trámite que se encuentre disponible:
	`insert into "Permisos" (email, tramite) values (EMAIL_API,TRAMITE);`
	- El email de pruebas (EMAIL_PRUEBAS) se utiliza para indicar el destinatario de los correos. El que envía el email es ``zz.mailer.sys2`` (noreply@etsit.upm.es)
	- Para probar las APIS, se debe indicar el EMAIL_API para API UPM, y UUID_API para API Ev. Curricular del alumno del que se quiere obtener la información
	- Es necesario crear previamente la base de datos con los parámetros que se pasan (POSTGRES_DB, DB_USERNAME, DB_PASSWORD). La base de datos puede ser un contenedor docker o instalarla en el propio host. Se trata de una BBDD PostgreSQL.
	

##### Conexión servicios remotos
###### Servidor mail:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/EMAIL-UPM)
- Host: `smtp.etsit.upm.es` *(variable de  entorno)*
- Port : 587 *(variable de  entorno)*
- User : `zz.mailer.sys2` *(variable de  entorno)*
- Sender: `Solicitud trámite <noreply@etsit.upm.es>` *(variable de  entorno)*
- Password: Consultar GID o GICO *(variable de  entorno)*

###### API UPM datos públicos planes:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-UPM#servicios-p%C3%BAblicos)
 - No hace falta autenticación 
- URL:  `https://www.upm.es/wapi_upm/academico/comun/index.upm/v2/` *(peticiones in code)*

###### API UPM datos privados matricula:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-UPM#informaci%C3%B3n-de-matr%C3%ADcula-de-un-alumno)
- PassPhrase:  Consultar GID o GICO *(variable de  entorno)*
- Certificados: Montar un volumen definido en ``docker-composoe.override.yml`` que mapee internamente a ``/app/certificates`` resultando en los certificados:
 - `/app/certificates/es_upm_etsit_mihorario_key.pem`
 - `/app/certificates/es_upm_etsit_mihorario_cert.pem`

###### API ETSIT UPM datos públicos planes:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-ETSIT-UPM)
- No hace falta autenticación 
- URL: `https://api.etsit.upm.es/upm/public`  *(variable de entorno)*

######  API Evaluación Curricular:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-EVALUACI%C3%93N-CURRICULAR)
- Username: Consultar GID o GICO*(variable de  entorno)*
- Password: Consultar GID o GICO *(variable de  entorno)*
- URL: `https://api.etsit.upm.es/stats/report/evaluacion_curricular` *(variable de  entorno)*

###### API PERON
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-PERON)
- URL: `https://legacy.etsit.upm.es/etsitAPIRest/consultaNodoFinalizacion.php?uuid=` *(peticiones in code)*


###### CAS
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/CAS,-Central-Authentication-Service)
- Contextos:
	- `/pas/gestion-tramites/` *(variable de  entorno)*
	- `/estudiantes/gestion-tramites/`*(variable de  entorno)*
- Servidor: https://siupruebas.upm.es/cas *(variable de  entorno)*
- Servicio: https://pruebas.etsit.upm.es *(variable de  entorno)*

### Local (sin Docker)
#### Back
##### Variables de entorno
Se deben copiar las variables presentes en el fichero  `back/local.template.env` en el siguiente fichero `back/local.env`. Este fichero no se subirá al repositorio para proteger las credenciales del usuario. En este fichero se deben configurar las variables de entorno con contraseñas, ya que se encuentra en el `.gitignore`. Las variables de entorno son las siguientes:
###### local.env
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
DEV=true #entorno de desarrollo local
PRUEBAS=false
DOCKER=false
EMAIL_HOST=smtp.upm.es
EMAIL_PORT=587
EMAIL_USER=xxx@alumnos.upm.es #igual que EMAIL_SENDER
EMAIL_SENDER=xxx@alumnos.upm.es #igual que EMAIL_USER
EMAIL_PRUEBAS=xxx@alumnos.upm.es #destino de todos los emails
EMAIL_PASS= #contraseña del alumno (del email de pruebas) para enviar los mails
EMAIL_ADMIN= #email del encargado de gestionar permisos, como por ejemplo secretario.etsit@upm.es
API_ETSIT_UPM_URL=https://api.etsit.upm.es/upm/public
```
- Consideraciones:
	- En local no se pueden utilizar las APIs externas, por lo que se usan maquetas de datos **(DEV=true)**
	- **(DEV=true)** no  pasa por el CAS y crea un **usario inventado** (Fernando Fernández Fernández) con los roles (**FA**): PAS y Alumno 
	- En local se usa el correo de tipo @upm.es o @alumnos.upm.es, con las credenciales del usuario, para el envío de emails por parte de la aplicación. Se debe indicar el EMAIL_USER, el EMAIL_SENDER y la EMAIL_PASS con la contraseña del alumno. **EMAIL_USER debe ser el mismo que EMAIL_SENDER**
	- Configuración de CAS y SERVICE sirve para cualquier aplicación en localhost:3000. Aunque si **DEV=true** no pasa por el CAS
	- Es necesario crear previamente la base de datos con los parámetros que se pasan (POSTGRES_DB, DB_USERNAME, DB_PASSWORD). La base de datos puede ser un contenedor docker o instalarla en el propio host. Se trata de una BBDD PostgreSQL.
	- El email de pruebas (EMAIL_PRUEBAS) se utiliza para indicar el destinatario de los correos que envía la aplicación


##### Conexión servicios remotos
###### Servidor mail:
En desarrollo se usa una cuenta de correo personal de la upm.
- Host: `smtp.upm.es` *(variable de  entorno)*
- Port : 587 *(variable de  entorno)*
- User : Dirección correo personal del desarrollador *(variable de  entorno)*
- Sender: Dirección correo personal del desarrollador *(variable de  entorno)*
- Password: Contraseña correo personal del desarrollador *(variable de  entorno)*

###### API UPM datos públicos planes:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-UPM#servicios-p%C3%BAblicos)
 - No hace falta autenticación 
- URL:  `https://www.upm.es/wapi_upm/academico/comun/index.upm/v2/` *(peticiones in code)*

###### API UPM datos privados matricula:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-UPM#informaci%C3%B3n-de-matr%C3%ADcula-de-un-alumno)
Petición simulada *(peticiones in code)*

###### API ETSIT UPM datos públicos planes:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-ETSIT-UPM)
- No hace falta autenticación 
- URL: `https://api.etsit.upm.es/upm/public`  *(variable de entorno)*

######  API Evaluación Curricular:
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-EVALUACI%C3%93N-CURRICULAR)
Petición simulada *(peticiones in code)*

###### API PERON
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/API-PERON)
Petición simulada *(peticiones in code)*

###### CAS
- [Ver información](https://git.etsit.upm.es/grupointegraciondigital/wiki/-/wikis/Servicios-externos/CAS,-Central-Authentication-Service)
Conexión simulada *(peticiones in code)*

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
node_modules/.bin/sequelize db:migrate
```

Para deshacer las migraciones:
```shell
cd back
node_modules/.bin/sequelize db:migrate:undo
```

Para deshacer una migración determinada
```shell
cd back
node_modules/.bin/sequelize db:migrate:undo --name exampleNameMigration
```

#### Front
Si se quiere probar / desarrollar el front de un trámite realizado con **React.js**,  debe arrancar el back para poder realizar peticiones. Debe iniciarse como se indica en el apartado anterior. Otra opción si aún no está desarrollada la parte de back del trámite es utilizar jsons para simular los datos.

##### Arrancar el servidor de Front para desarrollar
Ver [Front README.md](front/README.md)


### Información otros trámites
**[1. Gestión de título](https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Trámites/Gesti%C3%B3n-de-t%C3%ADtulo)**

**[2. Solicitud de certificados](https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Trámites/Solicitud-de-certificados)**

**[3. Solicitud de evaluación curricular](https://git.etsit.upm.es/grupointegraciondigital/gestion-tramites/-/wikis/Trámites/Solicitud-de-evaluaci%C3%B3n-curricular)**
