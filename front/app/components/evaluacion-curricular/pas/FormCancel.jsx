import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/enums').estadosEvaluacionCurricular;

export default class FormCancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textCancel: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTextCancel = this.handleChangeTextCancel.bind(this);
        this.fecha = React.createRef();
    }

    handleChangeTextCancel(e) {
        this.setState({ textCancel: e.currentTarget.value })
    }

    handleSubmit(event) {
        let paramsToUpdate = {};
         if (this.props.peticion.estadoPeticion === estadosEvaluacionCurricular.EVALUACION_PENDIENTE) {
             paramsToUpdate.cancelNewState = estadosEvaluacionCurricular.EVALUACION_DENEGADA;
            if (!this.fecha.current.value) {
                alert(`Debe indicar la fecha en la que el tribunal se reunió.`);
            } else {
                paramsToUpdate.fecha = this.fecha.current.value;
            }
            } else {
            paramsToUpdate.cancelNewState = estadosEvaluacionCurricular.NO_CUMPLE_REQUISITOS;
        }

        event.preventDefault();
        if (this.state.textCancel.trim() == "") {
            alert("Debe indicar el motivo por el que se cancela la petición");
        } else {
            let textCancel = this.state.textCancel.trim();
            paramsToUpdate.textCancel = textCancel.trim();
            this.props.cambioEstadoClick(paramsToUpdate)
        }
    }

render() {
    let fecha;
    if (this.props.peticion.estadoPeticion === estadosEvaluacionCurricular.EVALUACION_PENDIENTE){
        fecha = <Form.Group controlId="fechaReunion">
        <Form.Label><b>FECHA DE REUNIÓN DEL TRIBUNAL:</b></Form.Label>
        <Form.Control type="date" name="fecha" placeholder="fecha de reunión" ref={this.fecha} />
      </Form.Group>
    }
    return (
        <div>
            <Modal.Body>
                Va a cancelar la petición de la evaluación curricular de {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo}) de {this.props.peticion.nombre} {this.props.peticion.apellido}.
                    <br />
                <br />
                <Form onSubmit={this.handleSubmit}>
                {fecha}
                    <Form.Group>
                        <Form.Label><b>Indique el motivo:</b></Form.Label>
                        <Form.Control onChange={this.handleChangeTextCancel} as="textarea" rows="3" />
                    </Form.Group>
                    
                </Form >
            </Modal.Body>
            <Modal.Footer>
               <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
            </Modal.Footer>
        </div>
    );
}
}
