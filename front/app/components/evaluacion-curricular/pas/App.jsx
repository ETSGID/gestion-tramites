
import React from 'react';
import axios from 'axios';
import Evaluaciones from './Evaluaciones'
import NoPermiso from '../../NoPermiso'
import '../../../../assets/scss/main.scss';
import LoadingOverlay from 'react-loading-overlay';
import { faBowlingBall } from '@fortawesome/free-solid-svg-icons';
const tramite = require('../../../../../back/enums').tramites.evaluacionCurricular;
let urljoin = require('url-join');
const apiBaseUrl = require('../../../../lib/apiBaseUrl').buildApiBaseUrl('pas', tramite[0]);
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;

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
    this.descargarInformes = this.descargarInformes.bind(this);
    this.descargarHistorico = this.descargarHistorico.bind(this);
    this.borrarPeticiones = this.borrarPeticiones.bind(this);
    this.recuperarPeticiones = this.recuperarPeticiones.bind(this);
  }

  componentDidMount() {
    this.checkPermisos();
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

  borrarPeticiones(tipo) {
    axios.delete(urljoin(apiBaseUrl, "api/delete"), { params: { tipo: tipo } })
      .then((response) => {
        this.setState({
          peticiones: response.data.peticiones,
          numberPeticiones: response.data.numberPeticiones,
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
  recuperarPeticiones(tipo) {
    if (confirm(`¿Desea recuperar todas las solicitudes de tipo ${tipo} del curso actual?`)) {
      axios.get(urljoin(apiBaseUrl, "api/recuperar/" + tipo))
      .then((response) => {
        this.setState({
          peticiones: response.data.peticiones,
          numberPeticiones: response.data.numberPeticiones,
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
  }

  cambioEstadoTramite(tramite) {
    let paramsToUpdate = {};
    switch (tramite) {
      case 'titulacion':
        if (this.state.disableTitulacion) {
          if (confirm(`ACTIVANDO LA EVALUACIÓN POR TITULACIÓN\n\nATENCIÓN: Se BORRARÁN todas las solicitudes de este tipo del periodo anterior (Para recupararlas, utilice el botón de RECUPERAR)`)) {
            paramsToUpdate.estadoTitulacion = 'ACTIVADO';
            this.setState({
              disableTitulacion: false,
              loading: true,
            });
            this.borrarPeticiones('titulación');
          }
        } else {
          if (confirm(`DESACTIVANDO LA EVALUACIÓN POR TITULACIÓN\n\nEl alumno ya no podrá solicitar este tipo de evaluación`)) {
            paramsToUpdate.estadoTitulacion = 'DESACTIVADO';
            this.setState({
              disableTitulacion: true,
              loading: true,
            });
          }
        }
        break;
      case 'curso':
        if (this.state.disableCurso) {
          if (confirm(`ACTIVANDO LA EVALUACIÓN POR CURSO\n\nATENCIÓN: Se BORRARÁN todas las solicitudes de este tipo del periodo anterior (Para recupararlas, utilice el botón de RECUPERAR)`)) {
            paramsToUpdate.estadoCurso = 'ACTIVADO';
            this.setState({
              disableCurso: false,
              loading: true,
            });
            this.borrarPeticiones('curso');
          }
        } else {
          if (confirm(`DESACTIVANDO LA EVALUACIÓN POR TITULACIÓN\n\nEl alumno ya no podrá solicitar este tipo de evaluación`)) {
            paramsToUpdate.estadoCurso = 'DESACTIVADO';
            this.setState({
              disableCurso: true,
              loading: true,
            });
          }
        }
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

  descargarInformes() {
    axios.get(urljoin(apiBaseUrl, "api/informes"), {
      headers: {
        'responseType': 'blob'
      }
    })
      .then((response) => {
        var file_path = "data:application/zip;base64," + response.data.content;
        var a = document.createElement("A");
        a.href = file_path;
        a.download = response.data.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '' : ''}`)
      })
  }

  descargarHistorico() {
    axios.get(urljoin(apiBaseUrl, "api/historico"), {
      headers: {
        'responseType': 'blob'
      }
    })
      .then((response) => {
        var file_path = "data:application/zip;base64," + response.data.content;
        var a = document.createElement("A");
        a.href = file_path;
        a.download = response.data.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '' : ''}`)
      })
  }

  render() {
    let evaluaciones;
    if (!this.state.tienePermiso) {
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
        descargarInformes={this.descargarInformes}
        descargarHistorico={this.descargarHistorico}
        recuperarPeticiones={this.recuperarPeticiones}
      >
      </Evaluaciones>
    } else {
      evaluaciones = "Cargando...";
    }

    return (
      <div>
        <div className="cuerpo">
          <h2>Solicitudes de evaluación curricular de alumnos</h2>
          <p><a href="/pas/gestion-tramites/">Volver al listado de trámites</a></p>

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
