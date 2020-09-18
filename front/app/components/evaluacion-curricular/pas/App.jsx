
import React from 'react';
import axios from 'axios';
import Evaluaciones from './Evaluaciones'
import NoPermiso from '../../NoPermiso'
import '../../../../assets/scss/main.scss';
import LoadingOverlay from 'react-loading-overlay';
const tramite = require('../../../../../back/enums').tramites.evaluacionCurricular;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service, "/pas/gestion-tramites", tramite[0]) : window.location.href


export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      plans: [],
      asignaturas: [],
      // numero de entradas totales en la base de datos
      numberPeticiones: 0,
      //plansCargado para pasar las options en el select
      plansCargado: false,
      selected: null,
      cancel: null,
      info: null,
      loading: null,
      disableTitulacion: null,
      disableCurso: null,
      tienePermiso: false
    };
    this.findPeticiones = this.findPeticiones.bind(this);
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    this.cambioEstadoTramite = this.cambioEstadoTramite.bind(this);
    this.checkPermisos = this.checkPermisos.bind(this);
  }

  componentDidMount() {
    this.checkPermisos();
    this.findPeticiones(1, 50, null);
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

  findPeticiones(page, sizePerPage, filters) {
    this.setState({
      loading: true
    })
    axios.get(urljoin(apiBaseUrl, "api/peticiones"), {
      params: {
        'page': page,
        'sizePerPage': sizePerPage,
        'filters': JSON.stringify(filters)
      }
    })
      .then((response) => {
        this.setState({
          peticiones: response.data.peticiones,
          numberPeticiones: response.data.numberPeticiones,
          plans: response.data.plans,
          loading: null,
          plansCargado: true,
          asignaturas: response.data.asignaturas
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
  checkPermisos() {
    axios.get(urljoin(apiBaseUrl, "api/permisos"))
      .then((response) => {
        var permisos = response.data.permisos;
        for (var i = 0; i < permisos.length; i++) {
          if (response.data.emailUser === permisos[i].email) {
            this.setState({
              tienePermiso: true,
              loading: null,
            })
            break;
          } else {
            this.setState({
              tienePermiso: false,
              loading: null,
            })
          }
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


  cambioEstadoClick(index, paramsToUpdate) {
    let peticionesNuevas = this.state.peticiones.slice()
    //para mandar el archivo hace falta crear un FormData
    let formData = new FormData();
    this.setState({
      loading: true,
      selected: null
    })
    formData.append("body", JSON.stringify({ peticion: peticionesNuevas[index], paramsToUpdate: paramsToUpdate, cancel: this.state.cancel }))
    axios.post(urljoin(apiBaseUrl, "api/peticionCambioEstado"), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        peticionesNuevas[index].estadoPeticion = response.data[1][0].estadoPeticion
        peticionesNuevas[index].fecha = response.data[1][0].fecha
        peticionesNuevas[index].textCancel = response.data[1][0].textCancel

        this.setState({
          peticiones: peticionesNuevas,
          selected: null,
          cancel: null,
          info: null,
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

  cambioSelectedClick(index, cancel, info) {
    this.setState({
      selected: index,
      cancel: cancel,
      info: info
    })
  }

  cambioEstadoTramite(tramite) {
    let paramsToUpdate = {};
    switch (tramite) {
      case 'titulacion':
        this.setState({
          disableTitulacion: !this.state.disableTitulacion,
          loading: true,
        });
        paramsToUpdate.estadoTitulacion = !this.state.disableTitulacion ? 'DESACTIVADO' : 'ACTIVADO';
        paramsToUpdate.estadoCurso = this.state.disableCurso ? 'DESACTIVADO' : 'ACTIVADO';
        break;
      case 'curso':
        this.setState({
          disableCurso: !this.state.disableCurso,
          loading: true
        });
        paramsToUpdate.estadoTitulacion = this.state.disableTitulacion ? 'DESACTIVADO' : 'ACTIVADO';
        paramsToUpdate.estadoCurso = !this.state.disableCurso ? 'DESACTIVADO' : 'ACTIVADO';
        break;
      default:
        return;
    }
    let formData = new FormData();
    formData.append("body", JSON.stringify({ paramsToUpdate: paramsToUpdate }));
    axios.post(urljoin(apiBaseUrl, "api/updateEstadoTramite"), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        this.setState({
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

  render() {
    let evaluaciones;
    if (!this.state.tienePermiso && this.state.plansCargado) {
      evaluaciones = <NoPermiso />
    } else if (this.state.plansCargado) {
      evaluaciones = <Evaluaciones
        selected={this.state.selected}
        cancel={this.state.cancel}
        info={this.state.info}
        peticiones={this.state.peticiones}
        numberPeticiones={this.state.numberPeticiones}
        plans={this.state.plans}
        asignaturas={this.state.asignaturas}
        cambioEstadoClick={this.cambioEstadoClick}
        cambioSelectedClick={this.cambioSelectedClick}
        findPeticiones={this.findPeticiones}
        cambioEstadoTramite={this.cambioEstadoTramite}
        disableCurso={this.state.disableCurso}
        disableTitulacion={this.state.disableTitulacion}
      >
      </Evaluaciones>
    } else {
      evaluaciones = "Cargando...";
    }

    return (
      <div>
        <div className="cuerpo">
          <h2>Peticiones de alumnos</h2>
          <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Cargando'
          >
            {evaluaciones}
          </LoadingOverlay>
        </div>
      </div>

    );
  }

}
