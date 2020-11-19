import React from 'react';
import { Modal, Button, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const formaPago = require('../../../../../back/enums').formaPago

export default class FormPago extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkFormaPago: null, disabledFile: "disabled" }
    this.fileInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlechangeFormaPago = this.handlechangeFormaPago.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handlechangeFormaPago(e) {
    let disabledFile = e.currentTarget.value == formaPago.ONLINE ? "disabled" : ""
    this.setState({ checkFormaPago: e.currentTarget.value, disabledFile: disabledFile })
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {
      formaPago: this.state.checkFormaPago
    }
    if(this.state.checkFormaPago == null){
      alert("Debe indicar forma de pago");
    }
    else if (!this.fileInput.current.files[0] && this.state.checkFormaPago != formaPago.ONLINE) {
      alert("Debe adjuntar la carta de pago");
    }else{
      //solo se pasa en este caso
      if(this.state.checkFormaPago != formaPago.ONLINE){
        paramsToUpdate.file1 = this.fileInput.current.files[0]
      }
      this.props.cambioEstadoClick(paramsToUpdate)
    }
  }

  handleClose(){
    this.props.handleClose();
  }

  render() {
    return (
      <div>
        <Modal.Body>
          Usted va a confirmar el pago del certicado académico solicitado, posteriormente será comprobado por el personal de la universidad.
          <br/><br/>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label as="legend">
                <b>Forma de pago</b>
              </Form.Label>
              <Form.Check
                type="radio"
                label="Pagado online (a través de politécnica virtual)"
                value={formaPago.ONLINE}
                name="formPago"
                onChange={this.handlechangeFormaPago}
              />
              <Form.Check
                type="radio"
                label="Pagado a través de carta de pago"
                name="formPago"
                value={formaPago.CARTA_PAGO}
                onChange={this.handlechangeFormaPago}
              />
              <Form.Label as="legend">
                Adjunte carta de pago
          </Form.Label>
              <input type="file" disabled={this.state.disabledFile} ref={this.fileInput} />
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
          <Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Enviar</Button>
        </Modal.Footer>
      </div>
    );
  }
}