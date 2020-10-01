import React from 'react';
import axios from 'axios';
import Certificados from './Certificados';
import FormPeticion from './FormPeticion';
import LoadingOverlay from 'react-loading-overlay';
import { Alert, Link, Button, Modal } from 'react-bootstrap';
import '../../../../assets/scss/main.scss';
const tramite = require('../../../../../back/enums').tramites.gestionCertificados;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service, "/estudiantes/gestion-tramites", tramite[0]) : window.location.href


export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      planes: [],
      selected: null,
      info: null,
      loading: null,
      plansCargado: false,
      showForm: false
    };
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    this.solicitarCertificado = this.solicitarCertificado.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    axios.get(urljoin(apiBaseUrl, "api/peticiones"))
      .then((response) => {
        this.setState({
          peticiones: response.data.peticiones,
          planes: response.data.planes,
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
    //index null si nueva peticion
    let peticionesNuevas = this.state.peticiones.slice()
    //para mandar el archivo hace falta crear un FormData
    let formData = new FormData();
    this.setState({
      loading: true
    });
    //sino había file se queda a null
    if (paramsToUpdate.file) {
      formData.append("file", paramsToUpdate.file);
    }
    if (paramsToUpdate.file2) {
      formData.append("file2", paramsToUpdate.file2)
    }
    let aux;
    let peticion = {};
    if(index !== null){ // actualizar peticion
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
        if(index == null){
          peticionesNuevas.push(res);
        } else {
        peticionesNuevas[aux].descuento = response.data[1][0].descuento
        peticionesNuevas[aux].formaPago = response.data[1][0].formaPago
        peticionesNuevas[aux].estadoPeticion = response.data[1][0].estadoPeticion
        peticionesNuevas[aux].fecha = response.data[1][0].fecha
        peticionesNuevas[aux].receptor = response.data[1][0].receptor
        peticionesNuevas[aux].localizacionFisica = response.data[1][0].localizacionFisica
        peticionesNuevas[aux].textCancel = response.data[1][0].textCancel
        }
        this.setState({
          peticiones: peticionesNuevas,
          selected: null,
          info: null,
          loading: null,
          plansCargado: true,
          showForm: false
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

  cambioSelectedClick(index, info) {
    this.setState({
      selected: index,
      info: info
    })
  }

  handleClose() {
    this.setState({
      showForm: false,
      selected: null,
      info: null
    })
  }

  solicitarCertificado() {
    this.setState({
      showForm: true
    })
  }



  render() {
    return (
      <div>
        <div className="cuerpo">
          <h2>Certificados Académicos</h2>
          <p>A continuación se presentan los Certificados Académicos que tenga solicitados. En caso de no tener solicitado ninguno, puede pedirlo haciendo click en el botón "Solicitar certificado académico"</p>
          <p><b>Se le enviarán notificaciones a través de su correo @alumnos.upm.es</b></p>
          <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Cargando'
          >
            <Alert variant="info">
              Antes de solicitar los certificados de notas, comprobar que se hayan incorporado todas las calificaciones a su expediente en Politécnica Virtual.
          </Alert>
            <span />
            <Button
              size="lg"
              style={{ marginBottom: "15px" }}
              onClick={() => this.solicitarCertificado()}
            >Solicitar certificado académico</Button>

            {this.state.showForm &&
              <Modal show={true} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Solicitud de certificado
                  </Modal.Title>
                </Modal.Header>
                <FormPeticion
                  handleClose={this.handleClose}
                  cambioEstadoClick={this.cambioEstadoClick}
                  planes={this.state.planes}
                />
              </Modal >
            }
            <Certificados
              selected={this.state.selected}
              info={this.state.info}
              peticiones={this.state.peticiones}
              cambioEstadoClick={this.cambioEstadoClick}
              cambioSelectedClick={this.cambioSelectedClick}
              handleClose={this.handleClose}
            />
          </LoadingOverlay>
        </div>
      </div>

    );
  }

}
