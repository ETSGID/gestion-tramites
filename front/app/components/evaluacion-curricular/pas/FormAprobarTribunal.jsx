import React from 'react';
import { Modal, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default class FormAprobarTribunal extends React.Component {
  constructor(props) {
    super(props);
    this.fecha = React.createRef();
    this.motivo = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.fecha.current.value) {
      alert(`Debe indicar la fecha en la que la comisión se reunió.`);
    } if (!this.motivo.current.value) {
      alert(`Debe añadir un texto que explique las conclusiones de la comisión.`);
    }
    else {
      let paramsToUpdate = {};
      paramsToUpdate.fecha = this.fecha.current.value;
      paramsToUpdate.motivo = this.motivo.current.value;
      this.props.cambioEstadoClick(paramsToUpdate);
    }
  }

  render() {
    return (
      <div>
        <Modal.Body>
          Debe comprobar que el tribunal correspondiente se reune para decidir sobre la evaluación curricular del alumno.
          En caso de que sea aprobada, se enviará un email de confirmación con los siguientes datos:
          <ul><li>
            <b>NOMBRE Y APELLIDOS:</b> {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.edupersonuniqueid})
          </li><li><b>ASIGNATURA</b>: {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo})
          </li><li><b>TITULACIÓN:</b> {this.props.peticion.planNombre} ({this.props.peticion.planCodigo})
          </li><li>
              <Form.Group controlId="fechaReunion">
                <Form.Label as="fecha"><b>FECHA DE REUNIÓN DE LA COMISIÓN:</b></Form.Label>
                <Form.Control type="date" name="fecha" placeholder="fecha de reunión" ref={this.fecha} />
              </Form.Group>
            </li><li>
              <Form.Group controlId="motivo">
                <Form.Label as="motivo"><b>MOTIVO</b></Form.Label>
                <Form.Control placeholder="Motivo..." ref={this.motivo} />
              </Form.Group>
            </li></ul>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button> */}
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Aprobar evaluación</Button>
        </Modal.Footer>
      </div>
    );
  }
}