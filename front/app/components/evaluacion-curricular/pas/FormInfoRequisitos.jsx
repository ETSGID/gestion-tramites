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
    let textRequisitos = "";
    if (this.props.tipo === "titulacion") {
      textRequisitos = <ul>
        <li>
          Asignaturas matriculadas este curso:
    </li>
        <li>
          Asignaturas suspensas:
    </li>
        <li>
          ECTS superados en toda la titulación:
    </li>
        <li>
          Últimas convocatorias de la asignatura:
    </li>
        <li>
          TFT:
    </li>
      </ul>;
    }
    else {

      textRequisitos = <ul>
        <li>
          Asignaturas suspensas del curso:
</li>
        <li>
         ECTS superados este curso :
</li>
        <li>
         Nota media:
</li>
        <li>
          Últimas convocatorias de la asignatura:
</li>
      </ul>;
    }
    return (
      <div>
        <Modal.Body>
          Debe verificar que el alumno {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}) cumple los requisitos para solicitar la evaluación curricular por <b>{this.props.peticion.tipo}</b> de la asignatura {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo}) del plan {this.props.peticion.planNombre} ({this.props.peticion.planCodigo}).
          <br />
          {textRequisitos}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Aceptar solicitud</Button>
        </Modal.Footer>
      </div>
    );
  }
}