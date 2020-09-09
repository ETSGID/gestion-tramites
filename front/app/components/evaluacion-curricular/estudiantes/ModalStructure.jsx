import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;
import InfoPeticion from './InfoPeticion';


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
    if (this.props.info) {
      form =
        <InfoPeticion
          peticion={this.props.peticion}
          handleClose={this.handleClose}
        >
        </InfoPeticion>
    }
    else {
      // switch (estadosEvaluacionCurricular[this.props.peticion.estadoPeticionTexto]) {
        
      //     break;
      }
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Solicitud evaluación curricular por {this.props.peticion.tipo} - {this.props.peticion.asignaturaNombre}
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}