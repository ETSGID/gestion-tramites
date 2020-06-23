
import React from "react";
import { Button, Form, Row, Col } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';

export default class CursoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planElegido: this.props.data.planes[0].idplan,
      contadorCaracteres: 0
    };
    this.planElegido = React.createRef();
    this.asignaturaElegida = React.createRef();
    this.texto = React.createRef();
    this.volverClick = this.volverClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cambiaAsignaturas = this.cambiaAsignaturas.bind(this);
    this.cuentaCaracteres = this.cuentaCaracteres.bind(this);
  }

  cuentaCaracteres() {
    var contador = this.texto.value.length;
    this.setState({
      contadorCaracteres: contador
    })
  }

  cambiaAsignaturas() {
    this.setState({
      planElegido: this.planElegido.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {};
    if (this.planElegido.value === "0") {
      alert("Debe seleccionar su plan de estudios")
    }
    else if (this.asignaturaElegida.value === "0") {
      alert("Debe seleccionar una asignatura");
    } else if (!this.texto.value) {
      alert("Debe rellenar la justificación");
    } else if( this.state.contadorCaracteres >= 500){
      alert("La justificación no debe contener más de 500 caracteres");
    }
    else {
      paramsToUpdate.planCodigo = this.planElegido.value;
      paramsToUpdate.asignaturaCodigo = this.asignaturaElegida.value;
      paramsToUpdate.justificacion = this.texto.value;
      paramsToUpdate.tipo = "curso";
      if (confirm(`¿Está seguro que quiere pedir el  certificado académico?`)) {
        console.log("confirmado", paramsToUpdate);
        this.props.cambioEstadoClick(null,paramsToUpdate); // index null porque no existe en la tabla, nueva peticion
      }
    }
  }

  render() {
    return (
      <div className="cuerpo">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <h2>Solicitud de evaluación curricular por curso</h2>
            <p>Compruebe sus datos y rellene el siguiente formulario para solicitar la evaluación curricular por curso.</p>
          </Grid>
          <Grid item xs={6}>
            <div id="data">
              <p>Nombre: {this.props.data.nombre}</p>
              <p>Apellidos: {this.props.data.apellidos}</p>
              <p>Email de contacto: {this.props.data.email}</p>
              <p>DNI: {this.props.data.dni}</p>
              <p>Curso actual: {this.props.data.cursoActual}</p>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Selecciona plan de estudios:</Form.Label>
                <Form.Control as="select" ref={select => this.planElegido = select} onChange={this.cambiaAsignaturas}>
                  {this.props.data.planes.map((plan, index) => (<option key={index} value={plan.idplan}>{plan.nombre}</option>))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Selecciona asignatura para solicitar evaluación curricular:</Form.Label>
                <Form.Control as="select" ref={select => this.asignaturaElegida = select} >
                  {this.props.data.asignaturas.map((asignatura, index) => ((asignatura.idplan === this.state.planElegido) ?
                    <option key={index} value={asignatura.asignatura}>{asignatura.nombre}</option> : null
                  ))
                  }
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Justificación:</Form.Label>
                <Form.Control as="textarea" rows="5" ref={textarea => this.texto = textarea} onChange={this.cuentaCaracteres} />
                <Form.Text muted>
                  {500 - this.state.contadorCaracteres} caracteres restantes
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Button variant="primary" type="submit" style={{ marginRight: 10 }} onClick={this.handleSubmit}>Solicitar</Button>
                <Button variant="primary" onClick={this.volverClick}>Cancelar</Button>
              </Form.Group>
            </Form>
          </Grid>
        </Grid>

      </div>
    );
  }

  volverClick() {
    this.props.handleClick('volver');
  }
}