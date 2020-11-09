import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default class FormInfoRequisitos extends React.Component {
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
    let textRequisitos =
    <div>
    <b>Datos del alumno</b>
     <ul>
     <li>Año de inicio de estudios:</li>
     <li>Asignaturas suspendidas 2 veces:</li>
     <li>Asignaturas suspendidas 3 veces:</li>
     <li>Asignaturas matriculadas el curso anterior:</li>
     <li>Asignaturas matriculadas el curso actual:</li>
     <li>Nota media:</li>
     <li>Estado del TFT:</li>
     </ul>
      <b>Datos de la asignatura solicitada</b>
      <ul>
     <li>Número de veces suspensa en el curso anterior:</li>
     <li>Número de veces suspensa en el curso actual:</li>
     <li>Número de veces suspensa en total:</li>
     <li>Fecha de última convocatoria:</li>
     <li>Información de las dos últimas convocatorias:</li>
      </ul>
      </div>;

    return (
      <div>
        <Modal.Body>
          Debe verificar que el alumno {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.edupersonuniqueid}) cumple los requisitos para solicitar la evaluación curricular por <b>{this.props.peticion.tipo}</b> de la asignatura {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo}) del plan {this.props.peticion.planNombre} ({this.props.peticion.planCodigo}).
          En caso contrario, seleccione la acción "Rechazar solicitud" y justifique el motivo.
          <br />
          {textRequisitos}
        </Modal.Body>
        <Modal.Footer>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Aceptar solicitud</Button>
          {/* <Button variant="danger" onClick={this.props.handleClose}>Rechazar solicitud</Button> */}
        </Modal.Footer>
      </div>
    );
  }
}