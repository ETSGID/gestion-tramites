# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v2.0.8 - 2021-07-19
### Changed
- Forma de generar los bundle.js (más ligeros)
### Fixed
- Evaluación curricular: no consultar ultima matricula, dejar seleccionar todos los planes y asigntura. Problme de api upm matricula del estudiante, devuelve vacío en vez la del curso pasado. En el futuro si se arregla volver a cambiarlo.  

## v2.0.7 - 2021-05-03
### Added
- Variable de entorno API_ETSIT_UPM_URL
- Doble titulaciones en gestion titulos


## v2.0.6 - 2021-04-20

### Added
- Variable de entorno API_PERON_URL

## v2.0.5 - 2021-03-06

### Added
- Información adicional api evaluación curricular: matriculadoMaster, numVecesSuspensoSobre4
- Log de la primera vez que el usario accede en la sesión

## v2.0.4 - 2021-02-21

### Added
- Recuperar las solicitudes del cursoa actual que ya no aparecen
- Las solicitudes se mantienen en la base de datos 10 años

## v2.0.3 - 2021-02-01

### Added
- Documentos descargables de informes e histórico en evaluacion-curricular
- Tipo certificado "OTRO" en gestion-certificados

### Changed
- Gestor de permisos


## v2.0.2 - 2021-01-09

### Added
- Trámite evaluacion-curricular


## v2.0.1 - 2020-11-27

### Added
- Trámite gestión-certificados
- Arrancar la base de datos con migraciones

### Changed
- Nuevo CAS

## v1 - 2020-06-30

### Added
- Lanzamiento inicial
- Trámite de gestión titulos
- Utilización de CAS antiguo para el login de usuario
- Base de datos sin migraciones
