import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import FormPeticion from './FormPeticion';
import FormPago from './FormPago';
const estadosCertificado = require('../../../../../back/code/enums').estadosCertificado;
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
      switch (estadosCertificado[this.props.peticion.estadoPeticionTexto]) {
        case estadosCertificado.NO_PEDIDO:
        case estadosCertificado.PETICION_CANCELADA:
          form = <FormPeticion
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormPeticion>
          break;
        case estadosCertificado.ESPERA_PAGO:
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
            Petición certificado - {this.props.peticion.planCodigo}
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}