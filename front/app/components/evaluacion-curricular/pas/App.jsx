
import React from 'react';
import axios from 'axios';
import Evaluaciones from './Evaluaciones'
import '../../../../assets/scss/main.scss';
import LoadingOverlay from 'react-loading-overlay';
const tramite = require('../../../../../back/code/enums').tramites.evaluacionCurricular;
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
    };
    this.findPeticiones = this.findPeticiones.bind(this);
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
  }
  componentDidMount() {
    this.findPeticiones(1, 50, null);
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


  cambioEstadoClick(index, paramsToUpdate) {
    let peticionesNuevas = this.state.peticiones.slice()
    //para mandar el archivo hace falta crear un FormData
    let formData = new FormData();
    //sino había file se queda a null
    if (paramsToUpdate.file) {
      formData.append("file", paramsToUpdate.file);
    }
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

  render() {
    let evaluaciones = "Cargando..."
    if (this.state.plansCargado) {
      evaluaciones = <Evaluaciones
        selected={this.state.selected}
        cancel={this.state.cancel}
        info={this.state.info}
        peticiones={this.state.peticiones}
        numberPeticiones={this.state.numberPeticiones}
        plans={this.state.plans}
        asignaturas ={this.state.asignaturas}
        cambioEstadoClick={this.cambioEstadoClick}
        cambioSelectedClick={this.cambioSelectedClick}
        findPeticiones={this.findPeticiones}
      >
      </Evaluaciones>
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
