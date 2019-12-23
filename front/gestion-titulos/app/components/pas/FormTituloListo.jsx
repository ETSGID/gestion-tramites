import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default class FormTituloListo extends React.Component {
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
    return (
      <div>
        <Modal.Body>
          Debe verificar que el título de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}) referente al plan {this.props.peticion.planCodigo} ya ha llegado.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
        </Modal.Footer>
      </div>
    );
  }
}