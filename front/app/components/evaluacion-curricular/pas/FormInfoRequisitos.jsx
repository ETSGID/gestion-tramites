import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const tramite = require('../../../../../back/enums').tramites.evaluacionCurricular;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service, "/pas/gestion-tramites", tramite[0]) : window.location.href
const helpers = require('../../../../../back/lib/helpers');

export default class FormInfoRequisitos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      datosCargados: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    const curso = helpers.getCursoAnio();
    let formData = new FormData();
    formData.append("body", JSON.stringify({ edupersonuniqueid: this.props.peticion.edupersonuniqueid, planCodigo: this.props.peticion.planCodigo, asignaturaCodigo: this.props.peticion.asignaturaCodigo, cursoAcademico: curso }))
    axios.post(urljoin(apiBaseUrl, "api/datosAlumno"), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        this.setState({
          data: response.data,
          datosCargados: true
        })
      })
      .catch((error) => {
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '' : ''}`)
      })
  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {}
    this.props.cambioEstadoClick(paramsToUpdate)
  }

  render() {
    let textRequisitos = "Cargando..."
    if (this.state.datosCargados) {
      let estadoTFT = "no matriculado";
      let matriculadoMaster = "no"
      if (this.state.data.aprobadoTFT) {
        estadoTFT = "aprobado"
      } else if (this.state.data.matriculadoTFT) {
        estadoTFT = "matriculado"
      }
      if (this.state.data.matriculadoMaster) {
        matriculadoMaster = "sí"
      }
      let notasAnteriores = 'aún no hay notas anteriores registradas';
      if (this.state.data.notasAnteriores.length >= 2) {
        let length = this.state.data.notasAnteriores.length;
        notasAnteriores = (<ul><li>{this.state.data.notasAnteriores[length - 2].convocatoria} de {this.state.data.notasAnteriores[length - 2].cursoAcademico}: {this.state.data.notasAnteriores[length - 2].calificacionAlfa}-{this.state.data.notasAnteriores[length - 2].calificacion}</li>
          <li>{this.state.data.notasAnteriores[length - 1].convocatoria} de {this.state.data.notasAnteriores[length - 1].cursoAcademico}: {this.state.data.notasAnteriores[length - 1].calificacionAlfa}-{this.state.data.notasAnteriores[length - 1].calificacion}</li></ul>)
      } else if (this.state.data.notasAnteriores.length == 1) {
        notasAnteriores = (<ul><li>{this.state.data.notasAnteriores[0].convocatoria} de {this.state.data.notasAnteriores[0].cursoAcademico}: {this.state.data.notasAnteriores[0].calificacionAlfa}-{this.state.data.notasAnteriores[0].calificacion}</li>
        </ul>)
      }

      let ultimaConvocatoria = 'aún no hay última convocatoria registrada';
      if (this.state.data.ultimaConvocatoria != undefined) {
        ultimaConvocatoria = this.state.data.ultimaConvocatoria;
      }

      textRequisitos =
        <div>
          <b>Datos del alumno {this.props.peticion.nombre} {this.props.peticion.apellido}</b>
          <ul>
            <li>Plan de estudios: {this.props.peticion.planNombre} ({this.props.peticion.planCodigo})</li>
            <li>Año de inicio de estudios: {this.state.data.anyoInicio}</li>
            <li>Curso académico de inicio: {this.state.data.cursoAcademicoInicio}</li>
            <li>Curso de última matrícula: {this.state.data.cursoUltimaMatricula}</li>
            <li>Asignaturas suspendidas 2 veces: {this.state.data.numAsigSuspendida2veces}</li>
            <li>Asignaturas suspendidas 3 veces: {this.state.data.numAsigSuspendida3veces}</li>
            <li>Asignaturas matriculadas el curso anterior: {this.state.data.numAsigMatriculaCursoAnterior}</li>
            <li>Asignaturas matriculadas el curso actual: {this.state.data.numAsigMatriculaCursoActual}</li>
            <li>Nota media titulación: {this.state.data.notaMedia}</li>
            <li>Nota media curso: {this.state.data.notaMediaCurso}</li>
            <li>Estado del TFT: {estadoTFT}</li>
            <li>ECTS pendientes: {this.state.data.creditosPendientes}</li>
            <li>Matriculado Máster: {matriculadoMaster}</li>
          </ul>
          <b>Datos de la asignatura {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo})</b>
          <ul>
            <li>Número de veces suspensa en el curso anterior: {this.state.data.numVecesSuspensoCursoAnterior}</li>
            <li>Número de veces suspensa en el curso actual: {this.state.data.numVecesSuspensoCursoActual}</li>
            <li>Número de veces suspensa en total: {this.state.data.numVecesSuspenso}</li>
            <li>Número de veces con nota superior a 4: {this.state.data.numVecesSuspensoSobre4}</li>
            <li>Fecha de última convocatoria: {ultimaConvocatoria}</li>
            <li>Dos últimas calificaciones: {notasAnteriores}</li>
          </ul>
        </div>;
    }

    return (
      <div>
        <Modal.Body>
          Debe verificar que el alumno cumple los requisitos para solicitar la evaluación curricular por <b>{this.props.peticion.tipo}</b> de la asignatura solicitada.
          <br></br>En caso contrario, seleccione la acción "Rechazar solicitud" y justifique el motivo.
          <br />
          {textRequisitos}
        </Modal.Body>
        <Modal.Footer>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Aceptar solicitud</Button>
          {/* <Button variant="danger" onClick={this.props.handleClose}>Rechazar solicitud</Button> */}
        </Modal.Footer>
      </div>
    );
  }
}