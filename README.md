# App gestión de trámites ETSIT UPM

## Resumen
Aplicación para gestión de trámites en la ETSIT UPM.
Trámites gestionados por la app:
- Gestión de títulos

El proyecto se separa en dos partes:
**1. Back**
- Contiene la lógica de la aplicación y la conexión con la base de datos.
- Módulos comunes para todos los trámites y específicos para cada uno.

**1. Front**
- Contiene parte front de cada trámite.
- Cada trámite es un proyecto distinto realizado en React.js
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
### Local (sin Docker)
#### Back
##### Variables de entorno
#### Front
### Producción o pruebas (con Docker)
#### Back
##### Variables de entorno
#### Front
##### Variables de entorno