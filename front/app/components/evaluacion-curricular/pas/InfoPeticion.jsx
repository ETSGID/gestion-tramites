
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;
const helpers = require('../../../../../back/lib/helpers');

export default class InfoPeticion extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        let denegado;
        if (estadosEvaluacionCurricular.SOLICITUD_CANCELADA == this.props.peticion.estadoPeticion || estadosEvaluacionCurricular.EVALUACION_DENEGADA == this.props.peticion.estadoPeticion) {
            denegado = <li>Motivo cancelacion: {this.props.peticion.textCancel}</li>
        }
        return (
            <div>
                <Modal.Body>
                    <b>Resumen</b>
                    <ul>
                        <li>Plan: {this.props.peticion.planNombre} ({this.props.peticion.planCodigo})</li>
                        <li>Asignatura: {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo})</li>
                        <li>Tipo: {this.props.peticion.tipo}</li>
                        <li>Alumno: {this.props.peticion.nombre} {this.props.peticion.apellido}</li>
                        <li>Email: {this.props.peticion.email}</li>
                        <li>Estado Actual: {this.props.peticion.estadoPeticionTexto}</li>
                        <li>Última actualización: {helpers.formatFecha(this.props.peticion.fecha)}</li>
                        <li>Justificación: {this.props.peticion.justificacion}</li>
                        {denegado}
                    </ul>
                    </Modal.Body>
            </div>
        );
    }
} 