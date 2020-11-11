import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
const descuento = require('../../../../../back/enums').descuento

export default class FormPeticion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkDescuento: descuento.NO,
      disabledFile: "disabled",
      tipo: 'asignaturas_español_nota_media'
    }
    this.fileInputDescuento = React.createRef();
    this.fileDNI = React.createRef();
    this.planElegido = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescuentos = this.handleChangeDescuentos.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeTipo = this.handleChangeTipo.bind(this);
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
      tipo: this.state.tipo,
      plan: this.planElegido.value
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
        this.props.cambioEstadoClick(null, paramsToUpdate)
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
              <Form.Label>Selecciona plan de estudios:</Form.Label>
              <Form.Control as="select" ref={select => this.planElegido = select}>
                {this.props.planes.map((plan, index) => (<option key={index} value={plan.idplan}>{plan.nombre}</option>))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label as="legend">
                <b>Tipos de certificado</b>
              </Form.Label>
              <Form.Check
                type="radio"
                label="Asignaturas en español con nota media"
                defaultChecked
                value={'asignaturas_español_nota_media'}
                name="formTipo"
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="Asignaturas en inglés con nota media"
                name="formTipo"
                value={'asignaturas_ingles_nota_media'}
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="ECTS en inglés (sin nota media)"
                name="formTipo"
                value={'ects_ingles'}
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="Percentiles en inglés (sin nota media)"
                name="formTipo"
                value={'percentiles_ingles'}
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="Renovación título familia numerosa"
                name="formTipo"
                value={'renovacion_familia_numerosa'}
                onChange={this.handleChangeTipo}
              />
              <Form.Check className="d-inline-block"
                type="radio"
                label="Ficha informativa"
                name="formTipo"
                value={'ficha_informativa'}
                onChange={this.handleChangeTipo}
              /> <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" >
                Sin nota media, para surtir efectos dentro de la UPM.
              </Tooltip>}>
                <span className="d-inline-block">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </OverlayTrigger>
              <Form.Check
                type="radio"
                label="Hace constar..."
                name="formTipo"
                value={'hace_constar'}
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="Otro"
                name="formTipo"
                value={'otro'}
                onChange={this.handleChangeTipo}
              />
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