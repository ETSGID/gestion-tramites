
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Button } from 'react-bootstrap';
import FormInput from './FormInput.jsx';

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
            peticion.accion = peticion.estadoPeticion 
            peticion.estadoPeticionTexto = estadosTitulo[peticion.estadoPeticion] || estadosTitulo[2]
            peticion.nombreCompleto = peticion.apellido + " " + peticion.nombre
            return peticion
        })
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        }, {
            dataField: 'dni',
            text: 'DNI',
            filter: textFilter(),
            sort: true,
        },
        {
            dataField: 'nombreCompleto',
            text: 'Nombre',
            filter: textFilter(),
            sort: true,
        },
        {
            dataField: 'planCodigo',
            text: 'Plan',
            filter: textFilter(),
            sort: true
        },
        {
            dataField: 'estadoPeticionTexto',
            text: 'Estado petición',
            sort: true,
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
                switch (row.estadoPeticion) {
                    case 3:
                        return (<FormInput index={row.idTabla} cambioEstadoClick={this.cambioEstadoClick}></FormInput>)
                    case 4:
                        return (<Button variant="primary" onClick={() => this.cambioEstadoClick(row.idTabla)}>Carta pago recibida</Button>)
                    case 5:
                        return (<Button variant="primary" onClick={() => this.cambioEstadoClick(row.idTabla)}>Título listo para recoger</Button>)
                    case 6:
                        return (<Button variant="primary" onClick={() => this.cambioEstadoClick(row.idTabla)}>Título recogido</Button>)
                    default:
                        return (<span>No acción asociada</span>)
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
                filter={filterFactory()}
                
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
