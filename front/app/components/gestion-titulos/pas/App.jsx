
import React from 'react';
import axios from 'axios';
import Titulos from './Titulos'
import NoPermiso from '../../NoPermiso'
import '../../../../assets/scss/main.scss';
import LoadingOverlay from 'react-loading-overlay';
const tramite = require('../../../../../back/enums').tramites.gestionTitulos;
let urljoin = require('url-join');
const apiBaseUrl = require('../../../../lib/apiBaseUrl').buildApiBaseUrl('pas', tramite[0]);

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      plans: [],
      // numero de entradas totales en la base de datos
      numberPeticiones: 0,
      //plansCargado para pasar las options en el select
      plansCargado: false,
      selected: null,
      cancel: null,
      info: null,
      loading: null,
      tienePermiso: false
    };
    this.findPeticiones = this.findPeticiones.bind(this);
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    this.checkPermisos = this.checkPermisos.bind(this);
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
          plansCargado: true
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

  render() {
    let titulos = "Cargando..."
    if (!this.state.tienePermiso) {
      titulos = <NoPermiso />
    } else {
      if (this.state.plansCargado) {
        titulos = <Titulos
          selected={this.state.selected}
          cancel={this.state.cancel}
          info={this.state.info}
          peticiones={this.state.peticiones}
          numberPeticiones={this.state.numberPeticiones}
          plans={this.state.plans}
          cambioEstadoClick={this.cambioEstadoClick}
          cambioSelectedClick={this.cambioSelectedClick}
          findPeticiones={this.findPeticiones}
        >
        </Titulos>
      }
    }
    return (
      <div>
        <div className="cuerpo">
          <h2>Peticiones de alumnos</h2>
          <p><a href="/pas/gestion-tramites/">Volver al listado de trámites</a></p>
          <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Cargando'
          >
            {titulos}
          </LoadingOverlay>
        </div>
      </div>

    );
  }

}
