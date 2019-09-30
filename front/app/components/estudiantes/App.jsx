
import React from 'react';
import axios from 'axios';
import { Navbar } from 'react-bootstrap';
import Titulos from './Titulos.jsx'
import PlantillaAlumno from './../../jsons/alumno.json'
import './../../assets/scss/main.scss';
const apiBaseUrl =  process.env.NODE_ENV === "development" ?  "http://localhost:3000/estudiantes/gestion-titulos/" : window.location.href

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: PlantillaAlumno|| []
    };
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this)
  }

  componentDidMount() {
    axios.get((apiBaseUrl +  "api/peticiones"))
      .then((response) => {
        this.setState({
          peticiones: response.data,
        })
      })
      .catch(function (error) {
        alert("Error en la conexión con el servidor")
      })
  }

  cambioEstadoClick(index) {
    let peticionesNuevas = this.state.peticiones.slice()
    /*
    switch (peticionesNuevas[index].estadoPeticion) {
      case 2:
        peticionesNuevas[index].estadoPeticion ++;
        break;
      default:
        break;
    }
    this.setState({
      peticiones: peticionesNuevas,
    })
    */
    axios.post((apiBaseUrl +  "api/crearPeticion"),{
        peticion : peticionesNuevas[index]      
    })
    .then((response) => {
      peticionesNuevas[index].estadoPeticion = response.data.estadoPeticion
      peticionesNuevas[index].fecha = response.data.fecha
      this.setState({
        peticiones: peticionesNuevas,
      })
    })
    .catch(function (error) {
      alert("Error en la conexión con el servidor")
    })   
  }

  render() {
    return (
      <div>
        <Navbar className="barraInicio" variant="dark" expand="md">
          <Navbar.Brand>
            GESTIÓN DE TÍTULOS
          </Navbar.Brand>
          <div id="buttonStatic"></div>
        </Navbar>
        <div className="cuerpo">
          <h2>Titulaciones</h2>
          <p>A continuación se presentan las titulaciones que tiene finalizadas o en las que está matriculado. Recuerde que sólo puede pedir una titulación si la ha finalizado por completo</p>
          <Titulos peticiones={this.state.peticiones} cambioEstadoClick={this.cambioEstadoClick}></Titulos>
        </div>
      </div>

    );
  }

}
