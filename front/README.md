# front-end

## Descripción general

Cada trámite tiene dos bundles (`bundle_estudiantes.js` y `bundle_pas.js`), que se sirven desde el back-end. Existe un único fichero de ``webpack.config.js`` que funciona de la siguiente forma:

- `npm run startPas`: Abre un servidor de desarrollo en el puerto 4000 con el trámite configurado en el fichero `.env` y el perfil pas.

- `npm run buildPas`: Genera el bundle en la carpeta `front/build/[nombre-trámite]/bundle_pas.js` con el procediento configurado en el fichero `.env`

- `npm run startEstudiantes`: Abre un servidor de desarrollo en el puerto 4001 con el trámite configurado en el fichero `.env` y el perfil estudiantes.

- `npm run buildEstudiantes`: Genera el bundle en la carpeta `front/build/[nombre-trámite]/bundle_estudiantes.js` con el procediento configurado en el fichero `.env`.

En el fichero `.env` se **debe** poner el mismo nombre para los trámites que el que hay en el enum  ``back/code/enums.js`` y debe existir dicha entrada en el enum. Un ejemplo de configuración del enum es:

```json
exports.tramites = {
    "gestionTitulos": ["gestion-titulos", "Petición de título de grado/máster"],
    "nombreTramite": ["nombre-carpeta", "Nombre extendido procedimiento"]
}
```

## Ejemplo fichero .env
La siguiente configuración sirve para cuando se quiera trabajar con gestionTitulos.
```shell
TRAMITE=gestionTitulos
#TRAMITE=gestionCertificados
```
## Pasar a producción
El paso a producción es manual, copiando el ``bundle_estudiantes.js`` o el ``bundle_pas.js`` de la carpeta ``front/build/[nombre-trámite]/`` a la carpeta ``back/public/js/[nombre-trámite]/``. Está configurado así para evitar pisar el ``bundle.js`` de producción por error.