
import React from 'react';
import axios from 'axios';
import Titulos from './Titulos.jsx'
import './../../assets/scss/main.scss';
const tramite = require('../../../../../back/code/enums').tramites.gestionTitulos;
let urljoin = require('url-join');
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin("http://localhost:3000/estudiantes/gestion-titulos", tramite) : window.location.href


export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      selected: null,
      info: null
    };
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
  }

  componentDidMount() {
    axios.get(urljoin(apiBaseUrl + "api/peticiones"))
      .then((response) => {
        this.setState({
          peticiones: response.data
        })
      })
      .catch(function (error) {
        alert("Error en la conexión con el servidor")
      })
  }

  cambioEstadoClick(index, paramsToUpdate) {
    let peticionesNuevas = this.state.peticiones.slice()
    //para mandar el archivo hace falta crear un FormData
    let formData = new FormData();
    //sino había file se queda a null
    if(paramsToUpdate.file){
      formData.append("file", paramsToUpdate.file);
    }
    formData.append("body", JSON.stringify({peticion:peticionesNuevas[index], paramsToUpdate: paramsToUpdate}))
    axios.post(urljoin(apiBaseUrl + "api/peticionCambioEstado"), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        peticionesNuevas[index].estadoPeticion = response.data.estadoPeticion || response.data[1][0].estadoPeticion
        peticionesNuevas[index].fecha = response.data.fecha || response.data[1][0].fecha
        this.setState({
          peticiones: peticionesNuevas,
          selected: null,
          info: null
        })
      })
      .catch(function (error) {
        alert("Error en la conexión con el servidor")
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
        <div className="cuerpo">
          <h2>Titulaciones</h2>
          <p>A continuación se presentan las titulaciones que tiene finalizadas o en las que está matriculado. Recuerde que sólo puede pedir una titulación si la ha finalizado por completo</p>
          <Titulos
            selected={this.state.selected}
            info={this.state.info}
            peticiones={this.state.peticiones}
            cambioEstadoClick={this.cambioEstadoClick}
            cambioSelectedClick={this.cambioSelectedClick}
          >
          </Titulos>
        </div>
      </div>

    );
  }

}
