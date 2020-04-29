import React from 'react';
import axios from 'axios';
import '../../assets/scss/pagina-principal.scss';
const tramite = require('../../../back/code/enums').tramites;
let urljoin = require('url-join');
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin("http://localhost:3000/estudiantes/gestion-tramites/") : window.location.href

export default class Principal extends React.Component {

    constructor(props) {
    }
  
    componentDidMount() {
      axios.get(urljoin(apiBaseUrl, "api/peticiones"))
        .then((response) => {
          this.setState({
          })
        })
        .catch((error) => {
          alert("Error en la conexión con el servidor.")
        })
    }

    render() {
      return (
        <div>
          <div className="pagina-principal">
            <head>
             <meta charset="UTF-8"/>
             <title>LISTA DE TRÁMITES DISPONIBLES ONLINE</title>
             <meta name="viewport" content="width=device-width, initial-scale=1"/>
             <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
             <link rel='stylesheet' type="text/css" href='<%=context%>/stylesheets/index.css' />
            </head>

            <body>
             <div>
                 <p class="textoInicio">
                     En esta página se dispone el acceso a los trámites de secretaría que pueden realizarse de forma online.
                     <br/>
                     Para acceder a la normativa de los mismos <a href=" http://www.etsit.upm.es/escuela/secretaria-de-alumnos/tramites-de-secretaria.html">pinche aquí</a>
                     <br/>
                 </p>
             </div>

             <div>
                 <ul class="listaTramites">
                 
                    Object.values(tramites).forEach(tramite =>{

                        <a href="apiBaseUrl"><b><i><li>tramite[1]</li></i></b></a>
                    })
                 </ul>
             </div>
            </body>

          </div>
        </div>
  
      );
    }
  
}
  