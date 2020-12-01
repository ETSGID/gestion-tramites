import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const estadosCertificado = require('../../../../../back/enums').estadosCertificado;
import FormInfoPago from './FormInfoPago';
import FormConfirmarPago from './FormConfirmarPago';
import FormCertificadoEnviado from './FormCertificadoEnviado';
import FormCancel from './FormCancel';
import InfoPeticion from './InfoPeticion';
import FormValorarPago from './FormValorarPago';

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
      switch (estadosCertificado[this.props.peticion.estadoPeticionTexto]) {
        case estadosCertificado.SOLICITUD_ENVIADA:
        if(this.props.peticion.tipoCertificado === 7){
          form =
            <FormValorarPago
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
            >
            </FormValorarPago>
        } else {
          form =
          <FormInfoPago
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormInfoPago>
        }
          break;
        case estadosCertificado.PAGO_VALORADO:
          if(this.props.peticion.requierePago){
          form =
            <FormInfoPago
              peticion={this.props.peticion}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
            >
            </FormInfoPago>
          } else {
            form = <FormCertificadoEnviado
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormCertificadoEnviado>
          break;
          }
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
          form = <FormCertificadoEnviado
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormCertificadoEnviado>
          break;
        case estadosCertificado.CERTIFICADO_ENVIADO:
          form = <FormCertificadoEnviado
            peticion={this.props.peticion}
            handleClose={this.handleClose}
            cambioEstadoClick={this.cambioEstadoClick}
          >
          </FormCertificadoEnviado>
          break;
        default:
          break;
      }
    }
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Petición de certificado de {(this.props.peticion.nombre).replace(/(\B)[^ ]*/g, l => l.toLowerCase())} {(this.props.peticion.apellido).replace(/(\B)[^ ]*/g, l => l.toLowerCase())} - Plan {this.props.peticion.planCodigo}
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}