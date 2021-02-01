import React from 'react';
import { Modal } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;
const helpers = require('../../../../../back/lib/helpers');

export default class InfoPeticion extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let denegado;
        if (estadosEvaluacionCurricular.EVALUACION_DENEGADA == this.props.peticion.estadoPeticion || estadosEvaluacionCurricular.NO_CUMPLE_REQUISITOS == this.props.peticion.estadoPeticion) {
            denegado = <li>Motivo cancelación: {this.props.peticion.textCancel}</li>
        }

        return (
            <div>
                <Modal.Body>
                    <b>Resumen</b>
                    <ul>
                        <li>Plan: {this.props.peticion.planNombre} ({this.props.peticion.planCodigo})</li>
                        <li>Asignatura: {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo})</li>
                        <li>Tipo: {this.props.peticion.tipo}</li>
                        <li>Email de contacto: {this.props.peticion.email}</li>
                        <li>Estado actual: {this.props.peticion.estadoPeticionTexto}</li>
                        <li>Última actualización: {helpers.formatFecha(this.props.peticion.fecha)}</li>
                        {denegado}
                    </ul>
                </Modal.Body>
            </div>
        );
    }
} 