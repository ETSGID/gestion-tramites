
import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/code/enums').estadosEvaluacionCurricular;


export default class InfoPeticion extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        let denegado;
        if (estadosEvaluacionCurricular.SOLICITUD_CANCELADA== this.props.peticion.estadoPeticion || estadosEvaluacionCurricular.EVALUACION_DENEGADA == this.props.peticion.estadoPeticion) {
            denegado = <li>Motivo cancelacion: {this.props.peticion.textCancel}</li>
        }
        return (
            <div>
                <Modal.Body>
                    <b>Resumen</b>
                    <ul>
                        <li>Asignatura: {this.props.peticion.asignaturaCodigo}-{this.props.peticion.asignaturaNombre}</li>
                        <li>Plan: {this.props.peticion.planNombre} {this.props.peticion.planCodigo}</li>
                        <li>Tipo: {this.props.peticion.tipo}</li>
                        <li>Alumno: {this.props.peticion.nombre} {this.props.peticion.apellido}</li>
                        <li>Estado Actual: {this.props.peticion.estadoPeticionTexto}</li>
                        <li>Última actualización: {this.props.peticion.fecha || "Petición no registrada todavía"}</li>
                        <li>Justificación: {this.props.peticion.justificacion}</li>
                        {denegado}
                    </ul>
                </Modal.Body>
            </div>
        );
    }
} 