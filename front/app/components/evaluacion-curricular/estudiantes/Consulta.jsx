import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;
import ModalStructure from './ModalStructure';

export default class Consulta extends React.Component {
    constructor(props) {
        super(props)
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
        this.volverClick = this.volverClick.bind(this);

    }
    cambioEstadoClick(paramsToUpdate) {
        this.props.cambioEstadoClick(this.props.selected, paramsToUpdate)
    }
    cambioSelectedClick(index, info) {
        this.props.cambioSelectedClick(index, info)
    }
    volverClick() {
        this.props.handleClick('volver');
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
            text: 'Plan'
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
            text: 'Última Actualización'
        },
        {
            dataField: 'accion',
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                switch (estadosEvaluacionCurricular[row.estadoPeticionTexto]) {
                    case estadosEvaluacionCurricular.SOLICITUD_PENDIENTE:
                        return (<span>Su solicitud está siendo procesada por secretaría para verificar que cumple con los requisitos.</span>)
                    case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
                        return (<span>Usted cumple los requisitos y la solicitud está siendo procesada por el tribunal encargado.</span>)
                    case estadosEvaluacionCurricular.EVALUACION_DENEGADA:
                        return (<span>Su solicitud ha sido denegada por el tribunal.</span>)
                    case estadosEvaluacionCurricular.EVALUACION_APROBADA:
                        return (<span>Su solicitud ha sido aprobada.</span>)
                    case estadosEvaluacionCurricular.SOLICITUD_CANCELADA:
                        return (<span>Su solicitud ha sido cancelada.</span>)
                    case estadosEvaluacionCurricular.EVALUACION_FINALIZADA:
                    return (<span>Su proceso de solicitud ha sido dado por finalizado.</span>)
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

            <div className="cuerpo">
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
                
                <Button variant="primary" onClick={this.volverClick}>Volver</Button>
            </div>

        );

    }
}


const defaultSorted = [{
    dataField: 'index',
    order: 'desc'
}];

