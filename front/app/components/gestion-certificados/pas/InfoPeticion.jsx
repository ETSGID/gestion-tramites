import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosCertificado = require('../../../../../back/enums').estadosCertificado;
const descuento = require('../../../../../back/enums').descuento;
const formaPago = require('../../../../../back/enums').formaPago;

export default class InfoPeticion extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let receptor = <li>Receptor: El certificado académico no ha sido recogido todavía</li>
        let cancelado;
        let formaPagoText;
        let descuentoText;
        if (estadosCertificado.CERTIFICADO_RECOGIDO == this.props.peticion.estadoPeticion) {
            receptor = this.props.peticion.receptor ? <li>Receptor: {this.props.peticion.receptor}</li> : <li>Receptor: Recogido por el titular</li>
        }
        if (estadosCertificado.PETICION_CANCELADA == this.props.peticion.estadoPeticion) {
            cancelado = <li>Motivo cancelación: {this.props.peticion.textCancel}</li>
        }
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
                        {descuentoText}
                        {formaPagoText}
                        <li>Pago confirmado: {this.props.peticion.estadoPeticion >= estadosCertificado.PAGO_CONFIRMADO ? "Sí" : "No"}</li>
                        <li>Certificado recogido: {this.props.peticion.estadoPeticion >= estadosCertificado.CERTIFICADO_RECOGIDO ? "Sí" : "No"}</li>
                        {receptor}
                        <li>Localización física: {this.props.peticion.localizacionFisica || "No definida"}</li>
                        {cancelado}
                    </ul>
                </Modal.Body>
            </div>
        );
    }
}