
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosTitulo = require('../../../../../back/enums').estadosTitulo;
import ModalStructure from './ModalStructure';

export default class Titulos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            sizePerPage: 50           
        }
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }
    cambioEstadoClick(paramsToUpdate) {
        this.props.cambioEstadoClick(this.props.selected, paramsToUpdate)
    }
    cambioSelectedClick(index, cancel, info) {
        this.props.cambioSelectedClick(index, cancel, info)
    }

    handleTableChange(type, { page, sizePerPage, filters }) {
        this.setState({
            page: page,
            sizePerPage: sizePerPage
        })
        const filters2 = {};
        
        setTimeout(() => {
            // Handle column filters
            for (const filter in filters) {
                filters2[filter] = filters[filter].filterVal;
            }
            //call the api
            this.props.findPeticiones(page, sizePerPage, filters2);
        }, 2000);
    }

    render() {
        const planSelect = {};
        this.props.plans.forEach((plan, index) => {
            planSelect[plan.id] = `${plan.nombre} (${plan.id})`
        })

        const estadoSelect = {};
        for (const estado in estadosTitulo){
            estadoSelect[estado] = estado
        }

        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosTitulo).find(k => estadosTitulo[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.accion = peticion.estadoPeticion
            peticion.accion2 = peticion.estadoPeticion

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
        },
        {
            dataField: 'nombre',
            text: 'Nombre',
            filter: textFilter(),
        },
        {
            dataField: 'apellido',
            text: 'Apellidos',
            filter: textFilter(),
        },
        {
            dataField: 'planNombre',
            text: 'Plan',
            filter: selectFilter({
                options: planSelect
            })
        },
        {
            dataField: 'planCodigo',
            text: 'Plan Código'
        },
        {
            dataField: 'estadoPeticionTexto',
            text: 'Estado petición',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                return (
                    <span>{row.estadoPeticionTexto}</span>
                )
            },
            filter: selectFilter({
                options: estadoSelect
            })

        },
        {
            dataField: 'fecha',
            text: 'Última Actualización'
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
                        if (process.env.NODE_ENV === "development") {
                            return (<Button variant="warning" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Reinicar proceso</Button>)
                        } else {
                            return (<span>No acción asociada</span>)
                        }

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
                    remote={
                        { filter: true },
                        { pagination: true}
                    }
                    bootstrap4
                    wrapperClasses="table-responsive"
                    keyField="idTabla"
                    data={peticiones}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    striped={true}
                    filter={filterFactory()}
                    pagination={ paginationFactory({ page: this.state.page, sizePerPage: this.state.sizePerPage, totalSize: this.props.numberPeticiones }) }
                    onTableChange={this.handleTableChange}
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

