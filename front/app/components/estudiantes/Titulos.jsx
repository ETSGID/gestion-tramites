
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap';

export default class Titulos extends React.Component {
    constructor(props) {
        super(props)
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    }
    cambioEstadoClick(index) {
        this.props.cambioEstadoClick(index)
    }
    render() {
        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticion = peticion.estadoPeticion
            peticion.accion = peticion.estadoPeticion 
            peticion.estadoPeticionTexto = estadosTitulo[peticion.estadoPeticion] || estadosTitulo[2]
            return peticion
        })
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        },
        {
            dataField: 'planCodigo',
            text: 'Plan'
        },
        {
            dataField: 'estadoPeticionTexto',
            text: 'Estado petición',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                return (
                    <span>{row.estadoPeticionTexto}</span>
                )
            }

        },
        {
            dataField: 'fecha',
            text: 'Última Actualización'
        },
        {
            dataField: 'accion',
            text: 'acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                console.log(row.estadoPeticion)
                switch (row.estadoPeticion) {
                    case 2:
                        return (<Button variant="primary" onClick={() => this.cambioEstadoClick(row.idTabla)}>Solicitar título</Button>)
                        break;
                    default:
                        return (<span>No acción asociada</span>)
                        break;
                }
            }

        }];

        return (
            <BootstrapTable
                bootstrap4
                keyField="idTabla"
                data={peticiones}
                columns={columns}
                defaultSorted={defaultSorted}
                striped={true}                
            />
        );

    }
}


const defaultSorted = [{
    dataField: 'index',
    order: 'desc'
}];

const estadosTitulo = {
    1: "No posee la titulación",
    2: "No pedido",
    3: "Pedido por el alumno",
    4: "Falta carta de pago",
    5: "En espera del título",
    6: "Listo para recoger",
    7: "Recogido por el alumno"

}
