
import React from 'react';
import axios from 'axios';
import Titulos from './Titulos'
import './../../assets/scss/main.scss';
import LoadingOverlay from 'react-loading-overlay';
const tramite = require('../../../../../back/code/enums').tramites.gestionCertificados;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service,"/pas/gestion-tramites", tramite[0]) : window.location.href


export default class App extends React.Component {  

  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      selected: null,
      cancel: null,
      info: null,
      loading: null
    };
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
  }
  componentDidMount() {
    this.setState({
      loading: true
    })
    axios.get(urljoin(apiBaseUrl, "api/peticiones"))
      .then((response) => {
        this.setState({
          peticiones: response.data,
          loading: null
        })
      })
      .catch((error) => {
        this.setState({
          loading: null
        })
        alert("Error en la conexión con el servidor.")
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
        peticionesNuevas[index].descuento = response.data[1][0].descuento
        peticionesNuevas[index].formaPago = response.data[1][0].formaPago
        peticionesNuevas[index].estadoPeticion = response.data[1][0].estadoPeticion
        peticionesNuevas[index].fecha = response.data[1][0].fecha
        peticionesNuevas[index].receptor = response.data[1][0].receptor
        peticionesNuevas[index].localizacionFisica = response.data[1][0].localizacionFisica
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
        alert("Error en la conexión con el servidor.")
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
    return (
      <div>
        <div className="cuerpo">
          <h2>Peticiones de certificados de alumnos:</h2>
          <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Cargando'
          >
            <Titulos
              selected={this.state.selected}
              cancel={this.state.cancel}
              info={this.state.info}
              peticiones={this.state.peticiones}
              cambioEstadoClick={this.cambioEstadoClick}
              cambioSelectedClick={this.cambioSelectedClick}
            >
            </Titulos>
          </LoadingOverlay>
        </div>
      </div>

    );
  }

}
