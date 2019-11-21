import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export default class FormTituloRecoger extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkReceptor: 1, disabledTextReceptor: "disabled", textReceptor: "", textRegistro: "" }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeReceptor = this.handleChangeReceptor.bind(this);
    this.handleChangeTextReceptor = this.handleChangeTextReceptor.bind(this);
    this.handleChangeTextRegistro = this.handleChangeTextRegistro.bind(this);
  }

  handleChangeReceptor(e) {
    let disabledTextReceptor = e.currentTarget.value == 1 ? "disabled" : ""
    this.setState({ checkReceptor: e.currentTarget.value, disabledTextReceptor: disabledTextReceptor })
  }

  handleChangeTextReceptor(e) {
    this.setState({ textReceptor: e.currentTarget.value })
  }

  handleChangeTextRegistro(e) {
    this.setState({ textRegistro: e.currentTarget.value })
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.checkReceptor != 1 && this.state.textReceptor.trim() == "") {
      alert("Debe indicar el receptor (embajada, tercero autorizado, etc.)");
    } else if (this.state.textRegistro.trim() == "") {
      alert("Debe indicar la localización física del registro");
    }else {
      if (confirm(`Confirmar la recogida del título del plan ${this.props.peticion.planCodigo} por parte de ${this.props.peticion.nombre} ${this.props.peticion.apellido} (${this.props.peticion.irispersonaluniqueid}).`)) {
        let paramsToUpdate = {
          localizacionFisica: this.state.textRegistro.trim()
        }
        paramsToUpdate.receptor = this.state.checkReceptor == 1 ? null : this.state.checkReceptor.trim();
        this.props.cambioEstadoClick(paramsToUpdate)
      }
    }
  }

  render() {
    return (
      <div>
        <Modal.Body>
          Confirmar la recogida del título del plan {this.props.peticion.planCodigo} por parte de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}).
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label as="legend">
                <b>Seleccione receptor</b>
              </Form.Label>
              <Form.Check
                type="radio"
                label="Titular"
                defaultChecked
                value={1}
                name="formReceptor"
                onChange={this.handleChangeReceptor}
              />
              <Form.Check
                type="radio"
                label="Tercero (embajada, tercero autorizado, etc.)"
                name="formReceptor"
                value={2}
                onChange={this.handleChangeReceptor}
              />
              <br />
              <Form.Label as="legend">
                Indique el receptor si no es el titular:
              </Form.Label>
              <Form.Control type="text" disabled={this.state.disabledTextReceptor} onChange={this.handleChangeTextReceptor} placeholder="Receptor no titular" />
              <br />
              <Form.Label as="legend">
                Indique la localización física del registro (Libro de registro X folio Y registro Z):
              </Form.Label>
              <Form.Control type="text" onChange={this.handleChangeTextRegistro} placeholder="Libro de registro X folio Y registro Z" />
            </Form.Group>
          </Form >
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
        </Modal.Footer>
      </div>
    );
  }
}