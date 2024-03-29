
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosCertificado = require('../../../../../back/enums').estadosCertificado;
const tiposCertificado = require('../../../../../back/enums').tiposCertificado;
import ModalStructure from './ModalStructure';
import FormPeticion from './FormPeticion';

export default class Certificados extends React.Component {
    constructor(props) {
        super(props)
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    cambioEstadoClick(paramsToUpdate) {
        this.props.cambioEstadoClick(this.props.selected, paramsToUpdate)
    }
    cambioSelectedClick(index, info) {
        this.props.cambioSelectedClick(index, info)
    }
    
    handleClose(){
        this.props.handleClose();
    }

    render() {
        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.nombreCertificado = Object.keys(tiposCertificado).find(k => tiposCertificado[k] === peticion.tipoCertificado);
            peticion.estadoPeticionTexto = Object.keys(estadosCertificado).find(k => estadosCertificado[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.accion = peticion.estadoPeticionTexto
            return peticion
        })
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        },
        {
            dataField: 'planCodigo',
            text: 'Plan código'
        },
        {
            dataField: 'planNombre',
            text: 'Plan'
        },
        {
            dataField: 'nombreCertificado',
            text: 'Tipo certificado',
            formatter:(cellContent, row) => {
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
                    case estadosCertificado.PETICION_CANCELADA:
                        return (<div><span>Su petición ha sido cancelada. Para consultar el motivo, seleccione el icono de información.</span>
                        <Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false)}>Solicitar de nuevo</Button></div>)
                    case estadosCertificado.ESPERA_PAGO:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false)}>Confirmar pago</Button>)
                    case estadosCertificado.PAGO_CONFIRMADO:
                        return (<span>Se está generando su certificado académico. Se le notificará cuando esté listo.</span>)
                        case estadosCertificado.CERTIFICADO_ENVIADO:
                        return (<span>Su certificado académico ya está disponible y se le ha sido enviado al email de contacto. Si no lo ha recibido correctamente, contacte con secretaría.</span>)
                        case estadosCertificado.PAGO_VALORADO:
                            if (row.requierePago) {
                                return (<span>Su certificado requiere pago. Se está generando la carta de pago.</span>)
                            } else {
                                return (<span>Su certificado no requiere pago y está generándose. Se le notificará cuando esté listo.</span>)
                            }
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
                return (<Button variant="secondary" onClick={() => this.cambioSelectedClick(row.idTabla, true)}><FontAwesomeIcon icon={faInfoCircle} /></Button>)
            }

        }
        ];
        let modal;
        if ((this.props.selected !== null) && (typeof this.props.selected !== 'undefined')) {
            modal =
                <ModalStructure
                    peticion={this.props.peticiones[this.props.selected]}
                    handleClose={this.handleClose}
                    info={this.props.info}
                    cambioEstadoClick={this.cambioEstadoClick}
                    planes={this.props.planes}
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

