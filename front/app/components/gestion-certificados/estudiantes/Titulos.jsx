
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosCertificado = require('../../../../../back/code/enums').estadosCertificado;
import ModalStructure from './ModalStructure';

export default class Titulos extends React.Component {
    constructor(props) {
        super(props)
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    }
    cambioEstadoClick(paramsToUpdate) {
        this.props.cambioEstadoClick(this.props.selected, paramsToUpdate)
    }
    cambioSelectedClick(index, info) {
        this.props.cambioSelectedClick(index, info)
    }
    render() {
        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosCertificado).find(k => estadosCertificado[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.accion = peticion.estadoPeticionTexto
            return peticion
        })
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        },
        /*{
            dataField: 'planCodigo',
            text: 'Plan'
        },*/
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
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                switch (estadosCertificado[row.estadoPeticionTexto]) {
                    case estadosCertificado.NO_PEDIDO:
                    case estadosCertificado.PETICION_CANCELADA:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false)}>Solicitar Certificado</Button>)
                    case estadosCertificado.ESPERA_PAGO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false)}>Confirmar pago</Button>)
                    case estadosCertificado.CERTIFICADO_DISPONIBLE:
                        return (<span>Su certificado académico ya está disponible, pase a buscarlo.</span>)
                    case estadosCertificado.CERTIFICADO_RECOGIDO:
                        return (<span>Su certificado académico ya ha sido recogido.</span>)
                    default:
                        return (<span>Su solicitud está siendo procesada por secretaría.</span>)
                }
            }
        },
        {
            dataField: '',
            text: 'Info',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                return (<Button variant="secondary" onClick={() => this.cambioSelectedClick(row.idTabla, true)}><FontAwesomeIcon icon={faInfoCircle}/></Button>)
            }

        }
    ];
        let modal;
        if (this.props.selected !== null) {
            modal =
                <ModalStructure
                    peticion={this.props.peticiones[this.props.selected]}
                    handleClose={this.cambioSelectedClick}
                    info={this.props.info}
                    cambioEstadoClick={this.cambioEstadoClick}
                >
                </ModalStructure>
        }
        return (
            <div>
                <BootstrapTable
                    bootstrap4
                    wrapperClasses="table-responsive"
                    keyField="idTabla"
                    data={peticiones}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    striped={true}
                />
                {modal}


            </div>

        );

    }
}


const defaultSorted = [{
    dataField: 'index',
    order: 'desc'
}];
