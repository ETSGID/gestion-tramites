import React from 'react';
import { Modal, Button, Form} from 'react-bootstrap';

export default class FormPeticionTitulacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contadorCaracteresMotivo: 0,
      planElegido: -1
    }
    this.planElegido = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.cuentaCaracteres = this.cuentaCaracteres.bind(this);
    //this.cambiaAsignaturas = this.cambiaAsignaturas.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {};
    if (this.planElegido.value === "-1") {
      alert("Debe seleccionar su plan de estudios")
    } else if (this.asignaturaElegida.value === "-1") {
      alert("Debe seleccionar una asignatura");
    } else if (this.textoJustificacion.value === "") {
      alert("Debe rellenar la justificación");
    } else {
      paramsToUpdate.planCodigo = this.planElegido.value;
      paramsToUpdate.asignaturaCodigo = this.props.asignaturasMatriculadas[this.asignaturaElegida.value].asignaturaCodigo;
      paramsToUpdate.asignaturaNombre = this.props.asignaturasMatriculadas[this.asignaturaElegida.value].asignaturaNombre;
      paramsToUpdate.justificacion = this.textoJustificacion.value;
      paramsToUpdate.tipo = "titulación";
      console.log('params to update;',paramsToUpdate);
      if (confirm(`¿Está seguro de que quiere solicitar la evaluación curricular?`)) {
        this.props.cambioEstadoClick(null, paramsToUpdate); // index null porque no existe en la tabla, nueva peticion
      }
    }
  }

  handleClose() {
    this.props.handleClose();
  }

  // cambiaAsignaturas() {
  //   this.setState({
  //     planElegido: this.planElegido.value
  //   })
  // }


  cuentaCaracteres() {
    this.setState({
      contadorCaracteresMotivo: this.textoJustificacion.value.length
    })
  }


  render() {
    return (
      <div>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Selecciona plan de estudios:</Form.Label>
              <Form.Control as="select" ref={select => this.planElegido = select}>
                <option key={-1} value={-1}>-</option>
                {this.props.planesMatriculados.map((plan, index) => (<option key={index} value={plan.planCodigo}>{plan.planCodigo} - {plan.planNombre}</option>))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Selecciona asignatura:</Form.Label>
              <Form.Control as="select" ref={select => this.asignaturaElegida = select} >
              <option key={-1} value={-1}>-</option>
                  {this.props.asignaturasMatriculadas.map((asignatura, index) =>
                    <option key={index} value={index}>{asignatura.asignaturaCodigo} - {asignatura.asignaturaNombre}</option> )}
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Justificación:</Form.Label>
              <Form.Control as="textarea" rows="5" maxLength={500} minLength={1} ref={textarea => this.textoJustificacion = textarea} onChange={this.cuentaCaracteres} />
              <Form.Text muted>
                {500 - this.state.contadorCaracteresMotivo} caracteres restantes
                </Form.Text>
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