
import React from 'react';
import { Navbar } from 'react-bootstrap';
import Titulos from './Titulos.jsx'
import PlantillaPas from './../../jsons/pas.json'
import './../../assets/scss/main.scss';
import axios from 'axios'
const apiBaseUrl =  process.env.NODE_ENV === "development" ?  "http://localhost:3000/pas/gestion-titulos/" : window.location.href

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: PlantillaPas || []
    };
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
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
      case 3:
        peticionesNuevas[index].estadoPeticion++;
        break;
      case 4:
        peticionesNuevas[index].estadoPeticion++;
        break;
      case 5:
        peticionesNuevas[index].estadoPeticion++;
        break;
      case 6:
        peticionesNuevas[index].estadoPeticion++;
        break;
      default:
        break;
    }
    */
    axios.post((apiBaseUrl +  "api/peticionCambioEstado"),{
        peticion : peticionesNuevas[index]      
    })
    .then((response) => {
      peticionesNuevas[index].estadoPeticion = response.data[1][0].estadoPeticion
      peticionesNuevas[index].fecha = response.data[1][0].fecha
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
        <Navbar className="barraInicio sticky-top" variant="dark" expand="md">
          <Navbar.Brand>
            GESTIÓN DE TÍTULOS
          </Navbar.Brand>
          <div id="buttonStatic"></div>
        </Navbar>
        <div className="cuerpo">
          <h2>Peticiones de alumnos</h2>
          <Titulos peticiones={this.state.peticiones} cambioEstadoClick={this.cambioEstadoClick}></Titulos>
        </div>
      </div>

    );
  }

}
