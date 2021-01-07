
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;
import ModalStructure from './ModalStructure';
const helpers = require('../../../../../back/lib/helpers');

export default class Evaluaciones extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            sizePerPage: 50
        }
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.cambioEstadoTramite = this.cambioEstadoTramite.bind(this);
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

    cambioEstadoTramite(tramite){
        this.props.cambioEstadoTramite(tramite);
    }

    render() {
        const planSelect = {};
        this.props.plans.forEach((plan, index) => {
            planSelect[plan.id] = plan.nombre + ' (' + plan.id + ')';
        })

        const estadoSelect = {};
        for (const estado in estadosEvaluacionCurricular) {
            estadoSelect[estado] = estado
        }

        const tipoSelect = {
            titulación: "Titulación",
            curso: "Curso"
        };

        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosEvaluacionCurricular).find(k => estadosEvaluacionCurricular[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.accion = peticion.estadoPeticion
            peticion.accion2 = peticion.estadoPeticion

            return peticion
        })
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
            dataField: 'dni',
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
            text: 'Plan Codigo'
        },
        {
            dataField: 'asignaturaNombre',
            text: 'Asignatura',
            filter: textFilter(),
        },
        {
            dataField: 'asignaturaCodigo',
            text: 'Asignatura Codigo',
            filter: textFilter(),
        },
        {
            dataField: 'tipo',
            text: 'Tipo',
            filter: selectFilter({
                options: tipoSelect
            })
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
            formatter: (cellContent, row) => {
                return (
                    <span>{helpers.formatFecha(row.fecha)}</span>
                )
            },
        },
        {
            dataField: 'accion',
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                switch (row.estadoPeticion) {
                    case estadosEvaluacionCurricular.SOLICITUD_ENVIADA:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Revisar requisitos</Button>)
                    case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Aprobar evaluación</Button>)
                    case estadosEvaluacionCurricular.EVALUACION_APROBADA:
                        return (<Button variant="primary" onClick={() => this.cambioSelectedClick(row.idTabla, false, false)}>Confirmar nota</Button>)    
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
                    case estadosEvaluacionCurricular.SOLICITUD_ENVIADA:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Rechazar solicitud</Button>)
                    case estadosEvaluacionCurricular.EVALUACION_PENDIENTE:
                        return (<Button variant="danger" onClick={() => this.cambioSelectedClick(row.idTabla, true, false)}>Denegar evaluación</Button>)
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

        let botonTitulacion;
        let estadoTitulacion;
        if (this.props.disableTitulacion) {
            estadoTitulacion = "TRÁMITE DESACTIVADO";
            botonTitulacion = <Button variant="primary"  style={{ marginBottom: "10px", marginLeft:"10px" }} onClick={() => this.cambioEstadoTramite('titulacion')}> Activar</Button>
        } else {
            estadoTitulacion = "TRÁMITE ACTIVADO";
            botonTitulacion = <Button variant="danger"  style={{ marginBottom: "10px", marginLeft:"10px" }} onClick={() => this.cambioEstadoTramite('titulacion')}> Desactivar</Button>
        }

        let botonCurso;
        let estadoCurso;
        if (this.props.disableCurso) {
            estadoCurso = "TRÁMITE DESACTIVADO";
            botonCurso = <Button variant="primary"  style={{ marginBottom: "10px", marginLeft:"10px" }} onClick={() => this.cambioEstadoTramite('curso')}> Activar</Button>
        } else {
            estadoCurso = "TRÁMITE ACTIVADO";
            botonCurso = <Button variant="danger"   style={{ marginBottom: "10px", marginLeft:"10px" }}onClick={() => this.cambioEstadoTramite('curso')}> Desactivar</Button>
        }

       


        return (
            <div>
            <div class="row">
                <div class="col">
                Para activar o desactivar cada tipo de evaluación curricular:
                    <li>Estado evaluación por titulación: {estadoTitulacion}   {botonTitulacion}</li>
                    <li>Estado evaluación por curso: {estadoCurso}   {botonCurso}</li>
                </div>
                <div class="col">
                <p>Para descargar los informes: <Button variant="primary" style={{ marginBottom: "15px", marginLeft:"10px" }} onClick={() => this.props.descargarInformes()}> Descargar informes</Button></p>
                <p>Para descargar el histórico de solicitudes: <Button variant="primary" style={{ marginBottom: "15px", marginLeft:"10px" }} onClick={() => this.props.descargarHistorico()}> Descargar histórico</Button></p>
                </div>
            </div>
           
             <p></p>
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
    dataField: 'fecha',
    order: 'desc'
}];

