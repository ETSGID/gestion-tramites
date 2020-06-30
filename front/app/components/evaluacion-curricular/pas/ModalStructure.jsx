import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/code/enums').estadosEvaluacionCurricular;
import FormInfoRequisitos from './FormInfoRequisitos';
import FormAprobarTribunal from './FormAprobarTribunal';
import FormCancel from './FormCancel';
import InfoPeticion from './InfoPeticion';
import FormFinalizar from './FormFinalizar';

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
        case estadosEvaluacionCurricular.SOLICITUD_PENDIENTE:
          form =
            <FormInfoRequisitos
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
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
          case estadosEvaluacionCurricular.EVALUACION_DENEGADA:
          form = <FormFinalizar
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormFinalizar>
          break;
        default:
          break;
      }
    }
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.peticion.nombre} {this.props.peticion.apellido} - {this.props.peticion.asignaturaNombre} ({this.props.peticion.planCodigo})
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}