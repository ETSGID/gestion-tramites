import React from 'react';
import { Modal } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;
import FormInfoRequisitos from './FormInfoRequisitos';
import FormAprobarTribunal from './FormAprobarTribunal';
import FormCancel from './FormCancel';
import InfoPeticion from './InfoPeticion';
import FormConfirmarNota from './FormConfirmarNota';

export default class ModalStructure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
  }

  cambioEstadoClick(paramsToUpdate) {
    this.props.cambioEstadoClick(paramsToUpdate)
  }

  handleClose() {
    this.props.handleClose(null)
  }

  render() {
    let form;
    if (this.props.cancel) {
      form =
        <FormCancel
          peticion={this.props.peticion}
          handleClose={this.handleClose}
          cambioEstadoClick={this.cambioEstadoClick}
        >
        </FormCancel>
    }
    else if (this.props.info) {
      form =
        <InfoPeticion
          peticion={this.props.peticion}
          handleClose={this.handleClose}
        >
        </InfoPeticion>
    }
    else {
      switch (estadosEvaluacionCurricular[this.props.peticion.estadoPeticionTexto]) {
        case estadosEvaluacionCurricular.SOLICITUD_ENVIADA:
          form =
            <FormInfoRequisitos
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
              descargarInforme={this.props.descargarInforme}
            >
            </FormInfoRequisitos>
          break;
        case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
          form =
            <FormAprobarTribunal
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
            >
            </FormAprobarTribunal>
          break;
        case estadosEvaluacionCurricular.EVALUACION_APROBADA:
          form =
            <FormConfirmarNota
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
            >
            </FormConfirmarNota>
          break;
        default:
          break;
      }
    }
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Solicitud de evaluación curricular</Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}