import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';


export default class FormValorarPago extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {};
    paramsToUpdate.requierePago = event.currentTarget.value;
    this.props.cambioEstadoClick(paramsToUpdate)
  }

  render() {
    
    return (
      <div>
        <Modal.Body>
          Debe valorar si el certificado solicitado por el alumno requiere de pago o no.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" value="true" onClick={this.handleSubmit}>Requiere pago</Button>
          <Button  variant="danger" type="submit" value="false" onClick={this.handleSubmit}>No requiere pago</Button>
        </Modal.Footer>
      </div>
    );
  }
}