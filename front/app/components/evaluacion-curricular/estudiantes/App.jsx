import React from 'react';
import '../../../../assets/scss/main.scss';
import LoadingOverlay from 'react-loading-overlay';
import { Alert, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const tramite = require('../../../../../back/enums').tramites.evaluacionCurricular;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service, "/estudiantes/gestion-tramites", tramite[0]) : window.location.href


// Componentes
import FormPeticionTitulacion from './FormPeticionTitulacion';
import FormPeticionCurso from './FormPeticionCurso';
import Evaluaciones from "./Evaluaciones";
import { estadosEvaluacionCurricular } from '../../../../../back/enums';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      matricula: {},
      selected: null,
      info: null,
      loading: null,
      plansCargado: false,
      showFormTitulacion: false,
      showFormCurso: false,
      disableTitulacion: false,
      disableCurso: false
    };
    this.getPeticiones = this.getPeticiones.bind(this);
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    this.solicitarEvaluacion = this.solicitarEvaluacion.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: null
    })
    this.getEstadoTramites();
    this.getPeticiones();
  }

  getEstadoTramites() {
    axios.get(urljoin(apiBaseUrl, "/api/estadoTramite"))
      .then((response) => {
        this.setState({
          disableCurso: response.data[0].estadoCurso == "DESACTIVADO" ? true : false,
          disableTitulacion: response.data[0].estadoTitulacion == "DESACTIVADO" ? true : false
        })
      })
      .catch((error) => {
        this.setState({
          loading: null
        })
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '' : ''}`)
      })
  }

  getPeticiones() {
    axios.get(urljoin(apiBaseUrl, "api/peticiones"))
      .then((response) => {
        //disable boton si ya solicitud hecha
        response.data.peticiones.forEach(peticion => {
          if (peticion.tipo === "titulación" && peticion.estadoPeticion !== estadosEvaluacionCurricular["SOLICITUD_CANCELADA"]) {
            this.setState({
              disableTitulacion: true,
            })
          }
          if (peticion.tipo === "curso" && peticion.estadoPeticion !== estadosEvaluacionCurricular["SOLICITUD_CANCELADA"]) {
            this.setState({
              disableCurso: true,
            })
          }
        })
        this.setState({
          peticiones: response.data.peticiones,
          matricula: response.data.matricula,
          loading: null
        })
      })
      .catch((error) => {
        this.setState({
          loading: null
        })
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '' : ''}`)
      })


  }

  cambioEstadoClick(index, paramsToUpdate) {
    // index es null si es nueva peticion
    let peticionesNuevas = this.state.peticiones.slice();
    let formData = new FormData();
    this.setState({
      loading: true,
      selected: null,
      showFormTitulacion: false,
      showFormCurso: false
    });
    let aux;
    let peticion = {};
    if (index !== null) { // actualizar
      aux = index;
      peticion = peticionesNuevas[index];
    } else { // crear nueva peticion
      aux = peticionesNuevas.length;
      paramsToUpdate.contadorPeticiones = peticionesNuevas.length;
    }
    formData.append("body", JSON.stringify({ peticion: peticion, paramsToUpdate: paramsToUpdate }));
    axios.post(urljoin(apiBaseUrl, "api/peticionCambioEstado"), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        let res = response.data;
        if (res === null) { // ya existe esa peticion
          this.setState({
            loading: null
          })
          alert('Usted ya ha solicitado la evaluación curricular seleccionada. Si considera que ha habido algún error, mande un CAU en el siguiente enlace: https://appsrv.etsit.upm.es/cau/secretaria/');
        }
        else {
          if (index == null) {
            peticionesNuevas.push(res);
          } else {
            peticionesNuevas[aux].estadoPeticion = response.data.estadoPeticion || response.data[1][0].estadoPeticion;
            peticionesNuevas[aux].fecha = response.data.fecha || response.data[1][0].fecha;
            peticionesNuevas[aux].textCancel = response.data[1][0].textCancel
          }
          //disable boton si ya solicitud hecha
          peticionesNuevas.forEach(peticion => {
            if (peticion.tipo === "titulación" && peticion.estadoPeticion !== estadosEvaluacionCurricular["SOLICITUD_CANCELADA"]) {
              this.setState({
                disableTitulacion: true,
              })
            }
            if (peticion.tipo === "curso" && peticion.estadoPeticion !== estadosEvaluacionCurricular["SOLICITUD_CANCELADA"]) {
              this.setState({
                disableCurso: true,
              })
            }
          });
          this.setState({
            peticiones: peticionesNuevas,
            showFormTitulacion: false,
            showFormCurso: false,
            info: null,
            loading: null,
            plansCargado: true,
            selected: null
          })
        }
      })
      .catch((error) => {
        this.setState({
          loading: null
        });
        alert(`Error en la conexión con el servidor. ${error}`);
        console.log(error);
      })

  }

  cambioSelectedClick(index, info) {
    this.setState({
      selected: index,
      info: info
    })
  }

  handleClose() {
    this.setState({
      showFormTitulacion: false,
      showFormCurso: false,
      selected: null,
      info: null
    })
  }

  solicitarEvaluacion(tipo) {
    if (tipo === "titulacion") {
      this.setState({
        showFormTitulacion: true
      })
    } else if (tipo === "curso") {
      this.setState({
        showFormCurso: true
      })
    } else {
      this.setState({
        showFormCurso: false,
        showFormTitulacion: false
      })
    }
  }

  render() {
    return (
      <div>
        <div className="cuerpo">
          <h2>Solicitud de evaluación curricular</h2>
          <p>A continuación, se presentan las solicitudes de evaluación curricular que tenga solicitados. En caso de no tener solicitada ninguna, puede pedirla haciendo click en el botón "Solicitar"</p>
          <p><a href="/estudiantes/gestion-tramites/">Volver al listado de trámites</a></p>
          <p><b>Se le enviarán notificaciones a través de su correo @alumnos.upm.es</b></p>
          <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Cargando'
          >
            <Alert variant="info">
              <p>
                <li>El periodo de solicitud de evaluación curricular solamente estará abierto durante los días especificados en la <a href="http://www.etsit.upm.es/fileadmin/documentos/servicios/secretaria/archivos/Normativa_E.C._2017-18.pdf" target="_blank">normativa</a>. </li>
                <li>Antes de solicitar la evaluación curricular, deben haberse cerrado las actas de esa asignatura.</li>
                <li>Lea atentamente las diferencias entre cada tipo de evaluación curricular antes de solicitarla.</li>
              </p>
            </Alert>
            <p><b>Evaluación curricular por titulación:</b> en caso de que desee solicitar evaluación curricular de
              la última asignatura pendiente (excluyendo el TFT) de su plan
              de estudios, y cumple con los criterios especificados en la <a href="http://www.etsit.upm.es/fileadmin/documentos/servicios/secretaria/archivos/Normativa_E.C._2017-18.pdf" target="_blank">normativa</a>,
              solicite este tipo de evaluación curricular. Solamente podrá solicitar una por titulación.
                <Button
               style={{ marginBottom: "15px", marginLeft:"15px" }}
                disabled={this.state.disableTitulacion}
                onClick={() => this.solicitarEvaluacion('titulacion')}
              >Solicitar</Button>
              {this.state.disableTitulacion && <span className="info"> Actualmente no puede solicitar esta evaluación curricular</span>}
            </p>
            <p><b>Evaluación curricular por curso:</b> en caso de que desee solicitar evaluación curricular de
              una asignatura pendiente del curso actual, y cumple con los criterios especificados en la <a href="http://www.etsit.upm.es/fileadmin/documentos/servicios/secretaria/archivos/Normativa_E.C._2017-18.pdf" target="_blank">normativa</a>,
              solicite este tipo de evaluación curricular. Solamente podrá solicitar una por curso.   
              <Button
                style={{ marginBottom: "15px", marginLeft:"15px" }}
                disabled={this.state.disableCurso}
                onClick={() => this.solicitarEvaluacion('curso')}
              >Solicitar</Button>
              {this.state.disableCurso && <span className="info"> Actualmente no puede solicitar esta evaluación curricular</span>}
            </p>
            <span />
            {this.state.showFormTitulacion &&
              <Modal show={true} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Solicitud de evaluación curricular por titulación
                  </Modal.Title>
                </Modal.Header>
                <FormPeticionTitulacion
                  handleClose={this.handleClose}
                  cambioEstadoClick={this.cambioEstadoClick}
                  matricula={this.state.matricula}
                />
              </Modal >
            }
            {this.state.showFormCurso &&
              <Modal show={true} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Solicitud de evaluación curricular por curso
                  </Modal.Title>
                </Modal.Header>
                <FormPeticionCurso
                  handleClose={this.handleClose}
                  cambioEstadoClick={this.cambioEstadoClick}
                  matricula={this.state.matricula}
                />
              </Modal >
            }
            <Evaluaciones
              peticiones={this.state.peticiones}
              handleClose={this.handleClose}
              cambioEstadoClick={this.cambioEstadoClick}
              cambioSelectedClick={this.cambioSelectedClick}
              selected={this.state.selected}
              info={this.state.info}
            />
          </LoadingOverlay>
        </div>
      </div>
    );
  }

}







