
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosTitulo = require('../../../../../back/code/enums').estadosTitulo;
import ModalStructure from './ModalStructure.jsx';

export default class Titulos extends React.Component {
    constructor(props) {
        super(props)
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    }
    cambioEstadoClick(paramsToUpdate) {
        this.props.cambioEstadoClick(this.props.selected, paramsToUpdate)
    }
    cambioSelectedClick(index, cancel, info) {
        this.props.cambioSelectedClick(index, cancel, info)
    }
    render() {
        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosTitulo).find(k => estadosTitulo[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.accion = peticion.estadoPeticion
            peticion.accion2 = peticion.estadoPeticion
            peticion.nombreCompleto = peticion.apellido + " " + peticion.nombre
            return peticion
        })
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        }, {
            dataField: 'irispersonaluniqueid',
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
            text: 'Última Actualización',
            sort: true,
        },
        {
            dataField: 'accion',
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                switch (row.estadoPeticion) {
                    case estadosTitulo.PEDIDO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Carta de pago</Button>)
                    case estadosTitulo.PAGO_REALIZADO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Pago confirmado</Button>)
                    case estadosTitulo.PAGO_CONFIRMADO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Enviar resguardo</Button>)
                    case estadosTitulo.ESPERA_TITULO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Título listo</Button>)
                    case estadosTitulo.TITULO_DISPONIBLE:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Título recogido</Button>)
                    default:
                        return (<span>No acción asociada</span>)
                }
            }

        },
        {
            dataField: 'accion2',
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                switch (row.estadoPeticion) {
                    case estadosTitulo.PEDIDO:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Cancelar</Button>)
                    case estadosTitulo.ESPERA_PAGO:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Cancelar</Button>)
                    case estadosTitulo.PAGO_REALIZADO:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Cancelar</Button>)
                    case estadosTitulo.PAGO_CONFIRMADO:
                        return (<span>No acción asociada</span>)
                    case estadosTitulo.ESPERA_TITULO:
                        return (<span>No acción asociada</span>)
                    case estadosTitulo.TITULO_DISPONIBLE:
                        return (<span>No acción asociada</span>)
                    case estadosTitulo.TITULO_RECOGIDO:
                            return (<Button variant="warning" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Reinicar proceso</Button>)
                    default:
                        return (<span>No acción asociada</span>)
                }
            }

        },
        {
            dataField: '',
            text: 'Info',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                return (<Button variant="secondary" onClick={() => this.cambioSelectedClick(row.idTabla, false, true)}><FontAwesomeIcon icon={faInfoCircle} /></Button>)
            }

        }
        ];
        let modal;
        if (this.props.selected !== null) {
            modal =
                <ModalStructure
                    peticion={this.props.peticiones[this.props.selected]}
                    handleClose={this.cambioSelectedClick}
                    cancel={this.props.cancel}
                    info={this.props.info}
                    cambioEstadoClick={this.cambioEstadoClick}
                >
                </ModalStructure>
        }
        return (
            <div>
                <BootstrapTable
                    bootstrap4
                    keyField="idTabla"
                    data={peticiones}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    striped={true}
                    filter={filterFactory()}
                />
                {modal}
            </div>
        );
    }
}

const defaultSorted = [{
    dataField: 'DNI',
    order: 'desc'
}];

