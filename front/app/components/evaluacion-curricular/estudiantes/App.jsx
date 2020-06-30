import React from 'react';
import '../../../../assets/scss/main.scss';
import { Alert, Button } from 'react-bootstrap';
import axios from 'axios';

const tramite = require('../../../../../back/code/enums').tramites.evaluacionCurricular;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service, "/estudiantes/gestion-tramites", tramite[0]) : window.location.href


// Componentes
import TitulacionForm from './TitulacionForm';
import CursoForm from "./CursoForm";
import Consulta from "./Consulta";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataCurso: [],
      dataTitulacion: [],
      peticiones: [],
      loading: null,
      selected: null,
      info: null,
      showTitulacion: false,
      showCurso: false,
      showConsulta: false,
      showInicio: true,
      disableTitulacion: false,
      disableCurso: false,
      disableConsulta: true
    };
    this.handleClick = this.handleClick.bind(this);
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    this.getPeticiones = this.getPeticiones.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    axios.get(urljoin(apiBaseUrl, "/api/asignaturas/titulacion"))
      .then((response) => {
        this.setState({
          dataTitulacion: response.data,
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
    axios.get(urljoin(apiBaseUrl, "/api/asignaturas/curso"))
      .then((response) => {
        this.setState({
          dataCurso: response.data,
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
    this.getPeticiones();

  }

  getPeticiones() {
    axios.get(urljoin(apiBaseUrl, "api/peticiones"))
      .then((response) => {
        this.setState({
          peticiones: response.data,
          loading: null
        })
        
        if (this.state.peticiones.length > 0) {
          this.setState({
            disableConsulta: false
          })
        }
      })
      .catch((error) => {
        this.setState({
          loading: null
        })
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '' : ''}`)
      })
  }

  handleClick(servicio) {
    switch (servicio) {
      case 'titulacion':
        this.setState({
          showTitulacion: true,
          showInicio: false,
          //disableTitulacion: true
          disableTitulacion: false //pruebas
        });
        break;
      case 'curso':
        this.setState({
          showCurso: true,
          showInicio: false,
          //disableCurso: true
          disableCurso: false //pruebas
        });
        break;
      case 'consulta':
        this.setState({
          showConsulta: true,
          showInicio: false
        });
        break;
      case 'volver':
        this.getPeticiones();
        this.setState({
          showCurso: false,
          showTitulacion: false,
          showConsulta: false,
          showInicio: true
        });
        break;
      default:
        return;
    }
  }

  cambioEstadoClick(index, paramsToUpdate) {
    // index es null si es nueva peticion
    let peticionesNuevas = this.state.peticiones.slice();
    let formData = new FormData();
    this.setState({
      loading: true,
    });
    let peticion = {};
    var aux = index ? index : peticionesNuevas.length;
    paramsToUpdate.contadorPeticiones = peticionesNuevas.length;
    formData.append("body", JSON.stringify({ peticion: peticion, paramsToUpdate: paramsToUpdate }));
    axios.post(urljoin(apiBaseUrl, "api/peticionCambioEstado"), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        let res = response.data;
        peticionesNuevas.push(res);
        peticionesNuevas[aux].estadoPeticion = response.data.estadoPeticion || response.data[1][0].estadoPeticion;
        peticionesNuevas[aux].fecha = response.data.fecha || response.data[1][0].fecha;
        this.setState({
          peticiones: peticionesNuevas,
          loading: null,
          showCurso: false,
          showTitulacion: false,
          showConsulta: false,
          showInicio: true
        })
        if (this.state.peticiones.length > 0) {
          this.setState({
            disableConsulta: false
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

  render() {
    return (
      <div>
        {this.state.showInicio &&
          <div className="cuerpo">
            <h2>Solicitud de evaluación curricular</h2>
            <p>A continuación, se muestran los servicios disponibles relacionados con los trámites de evaluación curricular:</p>

            <Alert variant="info">
              <p>
                Recuerde que el periodo de solicitud de evaluación curricular solamente está abierto durante los días especificados en la normativa.
</p>
            </Alert>
            <ul>
              <p><b>Evaluación curricular por titulación</b></p>
              <p>En caso de que desee solicitar evaluación curricular de
              la última asignatura pendiente (excluyendo el TFT) de su plan
              de estudios, y cumple con los criterios especificados en la normativa,
solicite este tipo de evaluación curricular. Solamente podrá solicitar una por titulación.</p>
              <Button variant="primary" onClick={() => this.handleClick('titulacion')} disabled={this.state.disableTitulacion}>Solicitar</Button>
              {this.state.disableTitulacion && <p className="info"> Actualmente no puede solicitar esta evaluación curricular</p>}
            </ul>
            <ul>
              <p><b>Evaluación curricular por curso</b></p>
              <p>En caso de que desee solicitar evaluación curricular de
              una asignatura pendiente del curso actual, y cumple con los criterios especificados en la normativa,
solicite este tipo de evaluación curricular. Solamente podrá solicitar una por curso.</p>
              <Button variant="primary" onClick={() => this.handleClick('curso')} disabled={this.state.disableCurso}>Solicitar</Button>
              {this.state.disableCurso && <p className="info"> Actualmente no puede solicitar esta evaluación curricular</p>}
            </ul>
            <ul>
              <p><b>Consulta de estados de solicitud</b></p>
              <p>En esta sección podrá consultar el estado de su solicitud de evaluación curricular.</p>
              <Button variant="primary" onClick={() => this.handleClick('consulta')} disabled={this.state.disableConsulta}>Consulta</Button>{this.state.disableConsulta && <p className="info"> No tiene solicitudes en proceso</p>}
            </ul>
          </div>}

        {this.state.showTitulacion && <TitulacionForm
          data={this.state.dataTitulacion}
          peticiones={this.state.peticiones}
          handleClick={this.handleClick}
          cambioEstadoClick={this.cambioEstadoClick}
        />
        }
        {this.state.showCurso && <CursoForm
          data={this.state.dataCurso}
          peticiones={this.state.peticiones}
          handleClick={this.handleClick}
          cambioEstadoClick={this.cambioEstadoClick}
        />
        }
        {this.state.showConsulta && <Consulta
          peticiones={this.state.peticiones}
          handleClick={this.handleClick}
          cambioEstadoClick={this.cambioEstadoClick}
          cambioSelectedClick={this.cambioSelectedClick}
          selected={this.state.selected}
          info={this.state.info}
        />
        }
      </div>
    );
  }

}







