import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class FormCertificadoEnviado extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileCert = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {}
    if (!this.fileCert.current.files[0]) {
      alert("Debe adjuntar el certificado académico del alumno.")
    }
     else {
      paramsToUpdate.file = this.fileCert.current.files[0]
      this.props.cambioEstadoClick(paramsToUpdate)
    }
   
  }

  render() {
    return (
      <div>
        <Modal.Body>
          Para enviar al alumno el certificado académico a su email de contacto ({this.props.peticion.email}) debe adjuntarlo en el siguiente apartado:
          <br/><br/>
          <Form.Group>
              <input type="file" ref={this.fileCert} />
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">
                Solo pueden adjuntarse archivos con formato pdf y de tamaño máximo 1MB.
              </Tooltip>}>
                <span className="d-inline-block">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </OverlayTrigger>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
        </Modal.Footer>
      </div>
    );
  }
}