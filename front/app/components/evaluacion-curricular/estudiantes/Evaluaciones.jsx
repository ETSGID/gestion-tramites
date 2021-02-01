import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;
const helpers = require('../../../../../back/lib/helpers');
import ModalStructure from './ModalStructure';

export default class Evaluaciones extends React.Component {
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
    handleClose() {
        this.props.handleClose();
    }


    render() {
        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosEvaluacionCurricular).find(k => estadosEvaluacionCurricular[k] === peticion.estadoPeticion) || "NO_PEDIDO"
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
            dataField: 'asignaturaCodigo',
            text: 'Asignatura código'
        },
        {
            dataField: 'asignaturaNombre',
            text: 'Asignatura'
        },
        {
            dataField: 'tipo',
            text: 'Tipo'
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
            text: 'Última Actualización',
            formatter: (cellContent, row) => {
                return (
                    <span>{helpers.formatFecha(row.fecha)}</span>
                )
            }
        },
        {
            dataField: 'accion',
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                switch (estadosEvaluacionCurricular[row.estadoPeticionTexto]) {
                    case estadosEvaluacionCurricular.SOLICITUD_ENVIADA:
                        return (<span>Su solicitud está siendo procesada por secretaría para verificar que cumple con los requisitos.</span>)
                    case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
                        return (<span>Usted cumple los requisitos y la solicitud está siendo procesada por el tribunal encargado.</span>)
                    case estadosEvaluacionCurricular.EVALUACION_DENEGADA:
                        return (<span>Su solicitud ha sido denegada por el tribunal. Para consultar el motivo, haga click en el botón de info.</span>)
                    case estadosEvaluacionCurricular.EVALUACION_APROBADA:
                        return (<span>Su solicitud ha sido aprobada. Se le notificará cuando su nota se suba a Politécnica Virtual.</span>)
                    case estadosEvaluacionCurricular.NOTA_INTRODUCIDA:
                        return (<span>Su nota ha sido actualizada. Puede consultarla en Politécnica Virtual.</span>)
                    case estadosEvaluacionCurricular.NO_CUMPLE_REQUISITOS:
                        return (<span>Su solicitud ha sido cancelada. Para consultar el motivo, haga click en el botón de info.</span>)
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
                {
                    <BootstrapTable
                        bootstrap4
                        wrapperClasses="table-responsive"
                        keyField="idTabla"
                        data={peticiones}
                        columns={columns}
                        defaultSorted={defaultSorted}
                        striped={true}
                    />
                }
                {modal}
            </div>

        );

    }
}


const defaultSorted = [{
    dataField: 'index',
    order: 'desc'
}];

