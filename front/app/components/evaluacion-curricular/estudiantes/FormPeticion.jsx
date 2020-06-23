import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class FormPeticion extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkDescuento: descuento.NO, disabledFile: "disabled" }
    this.fileInputDNI = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.fileInputDNI.current.files[0]) {
      alert("Debe adjuntar su documento oficial de identidad (DNI/PASAPORTE), no se admite NIE")
    }
    else if (!this.fileInputDescuento.current.files[0] && this.state.checkDescuento != descuento.NO) {
      alert("Debe adjuntar la acreditación de familia numerosa");
    } else {
      paramsToUpdate.file = this.fileInputDNI.current.files[0]
      //solo se pasa en este caso
      if (confirm(`¿Está seguro que quiere pedir el título ${this.props.peticion.planNombre} (${this.props.peticion.planCodigo})?`)) {
        this.props.cambioEstadoClick(paramsToUpdate)
      }
    }
  }

  render() {
    return (
      <div>
        <Modal.Body>
          Usted va a solicitar el título {this.props.peticion.planNombre} ({this.props.peticion.planCodigo})
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label as="legend">
                Adjunte su documento oficial de identidad (DNI/PASAPORTE), no se admite NIE, escaneado por <b>ambas caras</b>
              </Form.Label>
              <input type="file" ref={this.fileInputDNI} />
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">
              Solo pueden adjuntarse archivos con formato pdf y de tamaño máximo 1MB.
              </Tooltip>}>
              <span className="d-inline-block">
              <FontAwesomeIcon icon={faInfoCircle}/>
              </span>
            </OverlayTrigger>
            </Form.Group>
          </Form >
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Enviar</Button>
        </Modal.Footer>
      </div>
    );
  }
}