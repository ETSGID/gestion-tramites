import React from 'react';
import axios from 'axios';
import Titulos from './Titulos';
import LoadingOverlay from 'react-loading-overlay';
import {Alert} from 'react-bootstrap';
import '../../../../assets/scss/main.scss';
const tramite = require('../../../../../back/code/enums').tramites.gestionTitulos;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service,"/estudiantes/gestion-tramites", tramite[0]) : window.location.href


export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      selected: null,
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
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
           error.response.data.error || '': ''}`)
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
    if (paramsToUpdate.file2) {
      formData.append("file2", paramsToUpdate.file2)
    }
    this.setState({
      loading: true,
      selected: null
    })
    formData.append("body", JSON.stringify({ peticion: peticionesNuevas[index], paramsToUpdate: paramsToUpdate }))
    axios.post(urljoin(apiBaseUrl, "api/peticionCambioEstado"), formData, {
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
          info: null,
          loading: null
        })
      })
      .catch((error) => {
        this.setState({
          loading: null
        })
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '': ''}`)
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
          <p>A continuación se presentan las titulaciones que tiene finalizadas.</p>
          <p><b>Se le enviarán notificaciones a través de su correo @alumnos.upm.es</b></p>
          
          <Alert variant="info">
            <p>
            Recuerde que tras superar todos los ECTS de la titulación, la solicitud de título estará disponible <b>dos días después</b> de que la nota del TFT se encuentre disponible en <a href="https://www.upm.es/politecnica_virtual/" target="_blank">Politécnica Virtual</a>.
            </p>
          </Alert>
          <Alert variant="info">
            <p>
            Sólo se podrán solicitar desde la aplicación los títulos que haya finalizado en el curso <b>2019-20 o posterior</b>. Las titulaciones finalizadas con fecha anterior debe solicitarlas a través del <a href="https://appsrv.etsit.upm.es/cau/secretaria/" target="_blank">Servicio CAU de Secretaría</a>.
            </p>
          </Alert>

          <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Cargando'
          >
            <Titulos
              selected={this.state.selected}
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
