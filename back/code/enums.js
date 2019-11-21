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

exports.descuento = {
    "NO": 1,
    "FAMILIA_NUMEROSA_GENERAL": 2,
    "FAMILIA_NUMEROSA_ESPECIAL": 3
}

exports.formaPago = {
    "ONLINE": 1,
    "CARTA_PAGO": 2
}