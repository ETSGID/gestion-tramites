import React from 'react';
import { Modal } from 'react-bootstrap';
import FormRestart from './FormRestart';
import FormPago from './FormPago';
const estadosCertificado = require('../../../../../back/enums').estadosCertificado;
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
    this.props.handleClose()
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
    else if (estadosCertificado[this.props.peticion.estadoPeticionTexto] == estadosCertificado.ESPERA_PAGO){
          form = <FormPago
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormPago>
    } else if(estadosCertificado[this.props.peticion.estadoPeticionTexto] == estadosCertificado.PETICION_CANCELADA){
      form = <FormRestart
        peticion={this.props.peticion}
        handleClose={this.handleClose}
        cambioEstadoClick={this.cambioEstadoClick}
      >
      </FormRestart>
    }
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Petición de certificado
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}