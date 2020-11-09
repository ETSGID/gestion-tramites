import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosCertificado = require('../../../../../back/enums').estadosCertificado;
import FormInfoPago from './FormInfoPago';
import FormConfirmarPago from './FormConfirmarPago';
import FormTituloListo from './FormCertificadoListo';
import FormTituloRecoger from './FormCertificadoRecoger';
import FormCancel from './FormCancel';
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
    if (this.props.cancel) {
      form =
      <FormCancel
        peticion={this.props.peticion}
        handleClose={this.handleClose}
        cambioEstadoClick={this.cambioEstadoClick}
      >
      </FormCancel>
    }
    else if(this.props.info){
      form =
      <InfoPeticion
        peticion={this.props.peticion}
        handleClose={this.handleClose}
      >
      </InfoPeticion>
    }
    else {
      switch (estadosCertificado[this.props.peticion.estadoPeticionTexto]) {
        case estadosCertificado.SOLICITUD_ENVIADA:
          form =
            <FormInfoPago
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
            >
            </FormInfoPago>
          break;
        case estadosCertificado.PAGO_REALIZADO:
          form =
            <FormConfirmarPago
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
            >
            </FormConfirmarPago>
          break;
        case estadosCertificado.PAGO_CONFIRMADO:
          form = <FormTituloListo
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormTituloListo>
          break;
        case estadosCertificado.ESPERA_CERTIFICADO:
          form = <FormTituloListo
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormTituloListo>
          break;
        case estadosCertificado.CERTIFICADO_DISPONIBLE:
          form = <FormTituloRecoger
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormTituloRecoger>
          break;
        case estadosCertificado.CERTIFICADO_RECOGIDO:
          form = <FormTituloRecoger
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormTituloRecoger>
          break;
        default:
          break;
      }
    }
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.peticion.nombre} {this.props.peticion.apellido} - {this.props.peticion.tipoCertificado} - {this.props.peticion.planCodigo}
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}