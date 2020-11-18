import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
const descuento = require('../../../../../back/enums').descuento

export default class FormRestart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkDescuento: descuento.NO,
      disabledFile: "disabled"
    }
    this.fileInputDescuento = React.createRef();
    this.fileDNI = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescuentos = this.handleChangeDescuentos.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleChangeDescuentos(e) {
    let disabledFile = e.currentTarget.value == descuento.NO ? "disabled" : ""
    this.setState({ checkDescuento: e.currentTarget.value, disabledFile: disabledFile })
  }

  handleChangeTipo(e) {
    this.setState({
      tipo: e.currentTarget.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {
      descuento: this.state.checkDescuento,
      plan: this.props.peticion.planCodigo
    }
    if (!this.fileDNI.current.files[0]) {
        alert("Debe adjuntar una copia de su DNI.")
      }
      else if ((!this.fileInputDescuento.current.files[0] && this.state.checkDescuento != descuento.NO) || (this.state.tipo === 'renovacion_familia_numerosa' && !this.fileInputDescuento.current.files[0])) {
        alert("Debe adjuntar la acreditación de familia numerosa");
      } else {
        //solo se pasa en este caso
        if (this.state.checkDescuento != descuento.NO) {
          paramsToUpdate.file2 = this.fileInputDescuento.current.files[0]
        }
        paramsToUpdate.file1 = this.fileDNI.current.files[0]
        if (confirm(`¿Está seguro que quiere pedir el certificado académico?`)) {
          this.props.cambioEstadoClick(paramsToUpdate)
        }
      }
  }

  handleClose() {
    this.props.handleClose();
  }



  render() {
    return (
      <div>
        <Modal.Body>
          {/* Usted va a solicitar un certificado académico. A día: {this.props.peticion.fecha} */}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label as="legend">
                Adjunte una copia de su DNI escaneado por las dos caras:
                <br />
              </Form.Label>
              <input type="file" ref={this.fileDNI} />
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">
                Solo pueden adjuntarse archivos con formato pdf y de tamaño máximo 1MB.
              </Tooltip>}>
                <span className="d-inline-block">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </OverlayTrigger>
            </Form.Group>
            <Form.Group>
              <Form.Label><b>Plan de estudios seleccionado:</b>
            <br></br>{this.props.peticion.planCodigo} - {this.props.peticion.planNombre}
            </Form.Label>
            </Form.Group>

            <Form.Group>
              <Form.Label as="legend">
                <b>Tipo de certificado seleccionado:</b>
                <br></br>
                {this.props.peticion.tipoCertificado.replace(/_/g," ")}
              </Form.Label>
             
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
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </OverlayTrigger>
            </Form.Group>
          </Form >
        </Modal.Body>
        { <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Enviar</Button>
        </Modal.Footer>}
      </div>
    );
  }
}