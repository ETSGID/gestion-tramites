 import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;


export default class InfoPeticion extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
       let denegado;
        if (estadosEvaluacionCurricular.SOLICITUD_DENEGADA == this.props.peticion.estadoPeticion ||estadosEvaluacionCurricular.EVALUACION_DENEGADA == this.props.peticion.estadoPeticion || estadosEvaluacionCurricular.SOLICITUD_CANCELADA == this.props.peticion.estadoPeticion) {
            denegado = <li>Motivo cancelación: {this.props.peticion.textCancel}</li>
        }
        
        return (
            <div>
                <Modal.Body>
                    <b>Resumen</b>
                    <ul>
                    <li>Asignatura: {this.props.peticion.asignaturaCodigo}-{this.props.peticion.asignaturaNombre}</li>
                        <li>Plan: {this.props.peticion.planNombre} {this.props.peticion.planCodigo}</li>
                        <li>Tipo: {this.props.peticion.tipo}</li>
                        <li>Email de contacto:{this.props.peticion.email}</li>
                        <li>Estado actual: {this.props.peticion.estadoPeticionTexto}</li>
                        <li>Última actualización: {this.props.peticion.fecha || "Petición no registrada todavía"}</li>
                        {denegado}
                    </ul>
                </Modal.Body>
            </div>
        );
    }
} 