import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import FormPeticion from './FormPeticion';
import FormPago from './FormPago';
const estadosTitulo = require('../../../../../back/code/enums').estadosTitulo;
import InfoPeticion from './InfoPeticion.jsx';


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
      switch (estadosTitulo[this.props.peticion.estadoPeticionTexto]) {
        case estadosTitulo.NO_PEDIDO:
        case estadosTitulo.PETICION_CANCELADA:
          form = <FormPeticion
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormPeticion>
          break;
        case estadosTitulo.ESPERA_PAGO:
          form = <FormPago
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormPago>
          break;
      }
    }
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Petición título - {this.props.peticion.planCodigo}
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}