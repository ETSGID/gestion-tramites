import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
const descuento = require('../../../../../back/enums').descuento
const tiposCertificado = require('../../../../../back/enums').tiposCertificado;

export default class FormPeticion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkDescuento: descuento.NO,
      disabledFile: "disabled",
      contadorCaracteresTitulo: 0,
      contadorCaracteresMotivo: 0,
      tipoCertificado: "1",
      otroChecked: false
    }
    this.fileInputDescuento = React.createRef();
    this.fileDNI = React.createRef();
    this.planElegido = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDescuentos = this.handleChangeDescuentos.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeTipo = this.handleChangeTipo.bind(this);
    this.cuentaCaracteres = this.cuentaCaracteres.bind(this);
  }
  handleChangeDescuentos(e) {
    let disabledFile = e.currentTarget.value == descuento.NO ? "disabled" : ""
    this.setState({ checkDescuento: e.currentTarget.value, disabledFile: disabledFile })
  }

  handleChangeTipo(e) {
    let otroChecked = e.currentTarget.value === "7" ? true : false;
    this.setState({
      tipoCertificado: e.currentTarget.value,
      otroChecked: otroChecked
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {
      descuento: this.state.checkDescuento,
      tipoCertificado: this.state.tipoCertificado,
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
      if(paramsToUpdate.tipoCertificado === "7"){
        console.log(this.textoTitulo.value);
        if(this.textoTitulo.value === ""){
          alert("Debe indicar el título del certificado");
          return;
        } else {
        paramsToUpdate.nombreCertificadoOtro = this.textoTitulo.value;
        paramsToUpdate.descripcion = this.textoMotivo.value;
        }
      }
      paramsToUpdate.file1 = this.fileDNI.current.files[0];
      if (confirm(`¿Está seguro que quiere pedir el certificado académico?`)) {
        this.props.cambioEstadoClick(null, paramsToUpdate)
      }
    }
  }

  handleClose() {
    this.props.handleClose();
  }

  cuentaCaracteres() {
    this.setState({
      contadorCaracteresTitulo: this.textoTitulo.value.length,
      contadorCaracteresMotivo: this.textoMotivo.value.length
    })
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
                {this.props.planes.map((plan, index) => (<option key={index} value={plan.id}>{plan.id} - {plan.nombre}</option>))}
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
                value={tiposCertificado.ASIGNATURAS_ESPAÑOL_CON_NOTA_MEDIA}
                name="formTipo"
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="Asignaturas en inglés con nota media"
                name="formTipo"
                value={tiposCertificado.ASIGNATURAS_INGLES_CON_NOTA_MEDIA}
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="ECTS en inglés (sin nota media)"
                name="formTipo"
                value={tiposCertificado.ECTS_INGLES}
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="Percentiles en inglés (sin nota media)"
                name="formTipo"
                value={tiposCertificado.PERCENTILES_INGLES}
                onChange={this.handleChangeTipo}
              />
              <Form.Check
                type="radio"
                label="Renovación título familia numerosa"
                name="formTipo"
                value={tiposCertificado.RENOVACION_TITULO_FAMILIA_NUMEROSA}
                onChange={this.handleChangeTipo}
              />
              <Form.Check className="d-inline-block"
                type="radio"
                label="Ficha informativa"
                name="formTipo"
                value={tiposCertificado.FICHA_INFORMATIVA}
                onChange={this.handleChangeTipo}
              /> <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" >
                Sin nota media, para surtir efectos dentro de la UPM.
              </Tooltip>}>
                <span className="d-inline-block">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </OverlayTrigger>
              <br></br>
              <Form.Check className="d-inline-block"
                type="radio"
                label="Otro"
                name="formTipo"
                value={tiposCertificado.OTRO}
                checked={this.state.otroChecked}
                onChange={this.handleChangeTipo}
              /> <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" >
                Adjunte la acreditación de familia numerosa en el apartado inferior si usted opta a descuento. Secretaría decidirá si el certificado solicitado requiere pago o no.
              </Tooltip>}>
                <span className="d-inline-block">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </OverlayTrigger>
            </Form.Group>
            {this.state.otroChecked && <Form.Group >
                <Form.Label>Indique un nombre para el tipo de certificado (Ej: TFT matriculado):</Form.Label>
                <Form.Control maxLength={20} minLength={1} as="textarea" rows="1" ref={textarea => this.textoTitulo = textarea} onChange={this.cuentaCaracteres} />
                <Form.Text muted>
                  {20 - this.state.contadorCaracteresTitulo} caracteres restantes
                </Form.Text>
              </Form.Group>
            }
            {this.state.otroChecked && <Form.Group >
                <Form.Label>Exponga el motivo del certificado:</Form.Label>
                <Form.Control maxLength={200} as="textarea" rows="3" ref={textarea => this.textoMotivo = textarea} onChange={this.cuentaCaracteres} />
                <Form.Text muted>
                  {200 - this.state.contadorCaracteresMotivo} caracteres restantes
                </Form.Text>
              </Form.Group>
            }
            

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