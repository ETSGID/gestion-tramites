//diferenciamos los periodos de la programacion docente por semestre y por ordinarios y extraordinarios
exports.estadosTitulo = {
    "NO_PEDIDO": 1,
    "PEDIDO": 2,
    "ESPERA_PAGO": 3,
    "PAGO_REALIZADO": 4,
    "PAGO_CONFIRMADO": 5,
    "ESPERA_TITULO": 6,
    "TITULO_DISPONIBLE": 7,
    "TITULO_RECOGIDO": 8,
    "PETICION_CANCELADA": -1
}


//UNIFICAR ESTADOS PARA TODOS LOS TRÁMITES!!!!!

exports.estadosCertificado = {
    "NO_PEDIDO": 1,
    "PEDIDO": 2,
    "ESPERA_PAGO": 3,
    "PAGO_REALIZADO": 4,
    "PAGO_CONFIRMADO": 5,
    "ESPERA_CERTIFICADO": 6,
    "CERTIFICADO_DISPONIBLE": 7,
    "CERTIFICADO_RECOGIDO": 8,
    "PETICION_CANCELADA": -1
}

exports.descuento = {
    "NO": 1,
    "FAMILIA_NUMEROSA_GENERAL": 2,
    "FAMILIA_NUMEROSA_ESPECIAL": 3
}

exports.formaPago = {
    "ONLINE": 1,
    "CARTA_PAGO": 2
}



exports.tramites = {
    "gestionTitulos": ["gestion-titulos", "Petición de título de grado/máster"],
    //"gestionCertificados": ["gestion-certificados", "Petición de certificados académicos"],
    /*
    "tituloDuplicado": ["titulo-duplicado", "Título Académico Duplicado"],
    "anulacionMatriculas": ["anulacion-matricula","Anulación de Matrícula"],
    "cancelacionAsignaturas":["cancelacion-asignaturas", "Cancelación de Asignaturas"],
    "devolucionTasas":["devolucion-tasas", "Devolución de Tasas"],
    "seguroMovilidadNacional":["seguro-movilidad", "Seguro de Movilidad Nacional"],
    "suplementoEuropeo":["suplemento-europeo", "Suplemento Europeo al Título"],
    "finEstudios":["fin-estudios", "Declaración Finalización de estudios. Acceso al Máster"],
    "recogidaDocumentos":["recogida-documentos", "Autorización de Recogida de Documentos"],
    "instanciaGeneral":["instancia-general", "Instancia General"]
    */
}