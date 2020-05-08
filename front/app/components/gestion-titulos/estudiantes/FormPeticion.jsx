import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
const descuento = require('../../../../../back/code/enums').descuento

export default class FormPeticion extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkDescuento: descuento.NO, disabledFile: "disabled" }
    this.fileInputDescuento = React.createRef();
    this.fileInputDNI = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescuentos = this.handleChangeDescuentos.bind(this);
  }
  handleChangeDescuentos(e) {
    let disabledFile = e.currentTarget.value == descuento.NO ? "disabled" : ""
    this.setState({ checkDescuento: e.currentTarget.value, disabledFile: disabledFile })
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {
      descuento: this.state.checkDescuento
    }
    if (!this.fileInputDNI.current.files[0]) {
      alert("Debe adjuntar su documento oficial de identidad (DNI/PASAPORTE), no se admite NIE")
    }
    else if (!this.fileInputDescuento.current.files[0] && this.state.checkDescuento != descuento.NO) {
      alert("Debe adjuntar la acreditación de familia numerosa");
    } else {
      paramsToUpdate.file = this.fileInputDNI.current.files[0]
      //solo se pasa en este caso
      if (this.state.checkDescuento != descuento.NO) {
        paramsToUpdate.file2 = this.fileInputDescuento.current.files[0]
      }
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

            <Form.Group>
              <Form.Label as="legend">
                <b>Descuentos aplicables</b>
              </Form.Label>
              <Form.Check
                type="radio"
                label="Sin descuento"
                defaultChecked
                value={descuento.NO}
                name="formDescuento"
                onChange={this.handleChangeDescuentos}
              />
              <Form.Check
                type="radio"
                label="Descuento familia numerosa general"
                name="formDescuento"
                value={descuento.FAMILIA_NUMEROSA_GENERAL}
                onChange={this.handleChangeDescuentos}
              />
              <Form.Check
                type="radio"
                label="Descuento familia numerosa especial"
                name="formDescuento"
                value={descuento.FAMILIA_NUMEROSA_ESPECIAL}
                onChange={this.handleChangeDescuentos}
              />
              <Form.Label as="legend">
                Adjunte acreditación familia numerosa:
              </Form.Label>
              <input type="file" disabled={this.state.disabledFile} ref={this.fileInputDescuento} />
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