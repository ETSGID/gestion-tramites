
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosCertificado = require('../../../../../back/enums').estadosCertificado;
const tiposCertificado = require('../../../../../back/enums').tiposCertificado;
import ModalStructure from './ModalStructure';

export default class Certificados extends React.Component {
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
        }, 1000);
    }
    render() {
        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosCertificado).find(k => estadosCertificado[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.nombreCertificado = Object.keys(tiposCertificado).find(k => tiposCertificado[k] === peticion.tipoCertificado);
            peticion.accion = peticion.estadoPeticion
            peticion.accion2 = peticion.estadoPeticion
            peticion.nombreCompleto = peticion.apellido + " " + peticion.nombre
            peticion.requierePago = peticion.requierePago
            return peticion
        })
        const planSelect = {};
        this.props.plans.forEach((plan, index) => {
            planSelect[plan.id] = plan.nombre + ' (' + plan.id + ')';
        })

        const estadoSelect = {};
        estadoSelect['TRAMITES_ACTIVOS'] = 'TRAMITES_ACTIVOS';
        estadoSelect['TRAMITES_FINALIZADOS'] = 'TRAMITES_FINALIZADOS';
        for (const estado in estadosCertificado) {
            estadoSelect[estado] = estado
        }
        const tipoSelect = {};
        for (const tipo in tiposCertificado) {
            tipoSelect[tipo] = tipo
        }
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        }, {
            dataField: 'edupersonuniqueid',
            text: 'Unique ID',
            hidden: true
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
            text: 'Plan código'
        },
        {
            dataField: 'nombreCertificado',
            text: 'Certificado',
            filter: selectFilter({
                options: tipoSelect
            }),
            formatter: (cellContent, row) => {
                if(row.nombreCertificado === "OTRO"){
                    return (
                        <p>{row.nombreCertificado} - {row.nombreCertificadoOtro}</p>)
                } else {
                return (
                    <p>{row.nombreCertificado}</p>)
                }
                
            }
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
            text: 'Última Actualización',
            sort: true
        },
        {
            dataField: 'accion',
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                switch (row.estadoPeticion) {
                    case estadosCertificado.SOLICITUD_ENVIADA:
                        if (row.tipoCertificado === 7) {
                            return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Valorar pago</Button>)
                        } else {
                            return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Carta de pago</Button>)
                        }
                    case estadosCertificado.PAGO_VALORADO:
                        if (row.requierePago) {
                            return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Carta de pago</Button>)
                        } else {
                            return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Enviar certificado</Button>)
                        }
                    case estadosCertificado.PAGO_REALIZADO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Pago confirmado</Button>)
                    case estadosCertificado.PAGO_CONFIRMADO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Enviar certificado</Button>)
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
                    case estadosCertificado.SOLICITUD_ENVIADA:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Cancelar</Button>)
                    case estadosCertificado.ESPERA_PAGO:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Cancelar</Button>)
                    case estadosCertificado.PAGO_VALORADO:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Cancelar</Button>)
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
                        { pagination: true }
                    }
                    bootstrap4
                    wrapperClasses="table-responsive"
                    keyField="idTabla"
                    data={peticiones}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    striped={true}
                    filter={filterFactory()}
                    pagination={paginationFactory({ page: this.state.page, sizePerPage: this.state.sizePerPage, totalSize: this.props.numberPeticiones })}
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

