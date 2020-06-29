import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default class FormAprobarTribunal extends React.Component {
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
          Debe comprobar que el tribunal correspondiente se reune para decidir sobre la evaluación curricular del alumno.
          En caso de que sea aprobada, seleccione el botón de "Aprobar evaluación".
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Aprobar evaluación</Button>
        </Modal.Footer>
      </div>
    );
  }
}