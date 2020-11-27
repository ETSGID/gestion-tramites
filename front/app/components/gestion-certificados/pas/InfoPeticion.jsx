import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosCertificado = require('../../../../../back/enums').estadosCertificado;
const descuento = require('../../../../../back/enums').descuento;
const formaPago = require('../../../../../back/enums').formaPago;
const tiposCertificado = require('../../../../../back/enums').tiposCertificado;

export default class InfoPeticion extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let cancelado;
        let formaPagoText;
        let descuentoText;
        if (estadosCertificado.PETICION_CANCELADA == this.props.peticion.estadoPeticion) {
            cancelado = <li>Motivo cancelación: {this.props.peticion.textCancel}</li>
        }
        let nombreCertificado = Object.keys(tiposCertificado).find(k => tiposCertificado[k] === this.props.peticion.tipoCertificado);
            
        switch (this.props.peticion.formaPago) {
            case formaPago.ONLINE:
                formaPagoText = <li>Forma de pago: Online</li>
                break;
            case formaPago.CARTA_PAGO:
                formaPagoText = <li>Forma de pago: Carta de pago</li>
                break;
            default:
                formaPagoText = <li>Forma de pago: No se ha especificado todavía</li>
                break;
        }
        switch (this.props.peticion.descuento) {
            case descuento.NO:
                descuentoText = <li>Descuento aplicado: Ninguno</li>
                break;
            case descuento.FAMILIA_NUMEROSA_GENERAL:
                descuentoText = <li>Descuento aplicado: Familia numerosa general</li>
                break;
            case descuento.FAMILIA_NUMEROSA_ESPECIAL:
                descuentoText = <li>Descuento aplicado: Familia numerosa especial</li>
                break;
            default:
                descuentoText = <li>Descuento aplicado: No se ha especificado todavía</li>
                break;
        }
        
        return (
            <div>
                <Modal.Body>
                    <b>Resumen</b>
                    <ul>
                    <li>Alumno: {this.props.peticion.nombre} {this.props.peticion.apellido}</li>
                        <li>Email: {this.props.peticion.email}</li>
                        <li>Unique ID: {this.props.peticion.edupersonuniqueid}</li>
                        <li>Plan: {this.props.peticion.planNombre} ({this.props.peticion.planCodigo})</li>
                        <li>Tipo de certificado: {nombreCertificado}</li>
                        <li>Estado Actual: {this.props.peticion.estadoPeticionTexto}</li>
                        <li>Última actualización: {this.props.peticion.fecha}</li>
                        {descuentoText}
                        {formaPagoText}
                        <li>Pago confirmado: {this.props.peticion.estadoPeticion >= estadosCertificado.PAGO_CONFIRMADO ? "Sí" : "No"}</li>
                        <li>Certificado enviado: {this.props.peticion.estadoPeticion >= estadosCertificado.CERTIFICADO_ENVIADO ? "Sí" : "No"}</li>
                        {cancelado}
                    </ul>
                </Modal.Body>
            </div>
        );
    }
}