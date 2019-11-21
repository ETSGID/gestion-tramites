import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
const formaPago = require('../../../../back/code/enums').formaPago
//Va a confirmar el pago del aluno XXX, lo ha realizado a través de YYY. Asegúrese de que es correcto.
export default class FormConfirmarPago extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {}
    this.props.cambioEstadoClick(paramsToUpdate)
  }

  render() {
    let formaPagoText
    switch (this.props.peticion.formaPago){
      case formaPago.ONLINE:
        formaPagoText = "ONLINE"
        break;
      case formaPago.CARTA_PAGO:
        formaPagoText = "A TRAVÉS DE CARTA DE PAGO"
        break;
    }
    return (
      <div>
        <Modal.Body>
          Debe confirmar el pago de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}) para la solicitud del título {this.props.peticion.planCodigo}.
          <br/>
          La modalidad seleccionada de pago ha sido <b>{formaPagoText}</b>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
        </Modal.Footer>
      </div>
    );
  }
}