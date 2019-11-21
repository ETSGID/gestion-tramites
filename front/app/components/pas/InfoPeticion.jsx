import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosTitulo = require('../../../../back/code/enums').estadosTitulo;
const descuento = require('../../../../back/code/enums').descuento;
const formaPago = require('../../../../back/code/enums').formaPago;

export default class InfoPeticion extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let receptor = <li>Receptor: El título no ha sido recogido todavía</li>
        let cancelado;
        let formaPagoText;
        let descuentoText;
        if (estadosTitulo.TITULO_RECOGIDO == this.props.peticion.estadoPeticion) {
            receptor = this.props.peticion.receptor ? <li>Receptor: Recogido por el titular</li> : <li>Receptor: {this.props.peticion.receptor}</li>
        }
        if (estadosTitulo.PETICION_CANCELADA == this.props.peticion.estadoPeticion) {
            cancelado = <li>Motivo cancelación: {this.props.peticion.textCancel}</li>
        }
        switch (this.props.peticion.formaPago) {
            case formaPago.ONLINE:
                formaPagoText = <li>Forma pago: Online</li>
                break;
            case formaPago.CARTA_PAGO:
                formaPagoText = <li>Forma pago: Carta de pago</li>
                break;
            default:
                formaPagoText = <li>Forma pago: No se ha especificado todavía</li>
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
                        <li>Plan: {this.props.peticion.planCodigo}</li>
                        <li>{this.props.peticion.nombreCompleto}</li>
                        <li>Estado Actual: {this.props.peticion.estadoPeticionTexto}</li>
                        <li>Última actualización: {this.props.peticion.fecha || "Petición no registrada todavía"}</li>
                        <li>Pago confirmado: {this.props.peticion.estadoPeticion >= estadosTitulo.PAGO_CONFIRMADO ? "Sí" : "No"}</li>
                        <li>Título recogido: {this.props.peticion.estadoPeticion >= estadosTitulo.TITULO_RECOGIDO ? "Sí" : "No"}</li>
                        {descuentoText}
                        {formaPagoText}
                        {receptor}
                        <li>Localización física: {this.props.peticion.localizacionFisica || "No definida"}</li>
                        {cancelado}
                    </ul>
                </Modal.Body>
            </div>
        );
    }
}