import React from 'react';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default class FormDocumento extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.fileInput.current.files[0]) {
      alert(`Debe adjuntar el documento generado de confirmación de ${this.props.peticion.nombre} ${this.props.peticion.apellido} (${this.props.peticion.irispersonaluniqueid}) referente a la evaluación curricular de tipo ${this.props.peticion.tipo} de la asignatura ${this.props.peticion.asignaturaNombre} (${this.props.peticion.asignaturaCodigo}) del plan ${this.props.peticion.planNombre} (${this.props.peticion.planCodigo}).`);
    } else {
      if (confirm(`Asegurese de que manda el documento correspondiente.`)) {
        let paramsToUpdate = {}
        //solo se pasa en este caso
        paramsToUpdate.file = this.fileInput.current.files[0]
        this.props.cambioEstadoClick(paramsToUpdate)
      }
    }
  }

  render() {
    return (
      <div>
        <Modal.Body>
        Debe adjuntar el documento generado de confirmación de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}) referente a la evaluación curricular de tipo {this.props.peticion.tipo} de la asignatura {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo}) del plan {this.props.peticion.planNombre} ({this.props.peticion.planCodigo}).
          <Form onSubmit={this.handleSubmit}>
            <Form.Label as="legend">
              Adjunte documento de confirmación
            </Form.Label>
            <input type="file" ref={this.fileInput} />
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">
              Solo pueden adjuntarse archivos con formato pdf y de tamaño máximo 1MB.
              </Tooltip>}>
              <span className="d-inline-block">
              <FontAwesomeIcon icon={faInfoCircle}/>
              </span>
            </OverlayTrigger>
          </Form >
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Enviar</Button>
        </Modal.Footer>
      </div >
    );
  }
}