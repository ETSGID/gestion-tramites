import React from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
const estadosEvaluacionCurricular = require('../../../../../back/code/enums').estadosEvaluacionCurricular;

export default class FormCancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { textCancel: "", cancelNewState: estadosEvaluacionCurricular.SOLICITUD_CANCELADA};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTextCancel = this.handleChangeTextCancel.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);

    }

    handleChangeTextCancel(e) {
        this.setState({ textCancel: e.currentTarget.value })
    }
    handleSubmit(event) {
        let textCancel;

        switch(this.state.cancelNewState){
            case estadosEvaluacionCurricular.SOLICITUD_CANCELADA:
                textCancel = "\n\nSe ha cancelado su solicitud. Si usted considera que ha habido algún error mande un CAU.  Pasará al estado: SOLICITUD_CANCELADA.\n\n Comentario Secretaría:\n ";
                break;
            case estadosEvaluacionCurricular.EVALUACION_DENEGADA:
                textCancel = "\n\nEl tribunal ha denegado su evaluación curricular. Pasará al estado: EVALUACION_DENEGADA.\n\nComentario Secretaría:\n ";
                break;
            default:
                textCancel = "";
                break;
        }

        textCancel+= this.state.textCancel.trim();

        event.preventDefault();
        if (textCancel.trim() == "") {
            alert("Debe indicar el motivo por el que se cancela la petición");
        } else {

            let paramsToUpdate = {

                textCancel : textCancel.trim(),
                cancelNewState: this.state.cancelNewState
            }
            this.props.cambioEstadoClick(paramsToUpdate)
        }
    }
    handleCheckBox (ev) {
        if (ev.currentTarget.value == estadosEvaluacionCurricular.SOLICITUD_CANCELADA) {
            this.setState({cancelNewState : estadosEvaluacionCurricular.SOLICITUD_CANCELADA});
        } else if (ev.currentTarget.value == estadosEvaluacionCurricular.EVALUACION_DENEGADA) {
            this.setState({ cancelNewState: estadosEvaluacionCurricular.EVALUACION_DENEGADA});
        }   else {
            this.setState({ cancelNewState: estadosEvaluacionCurricular.SOLICITUD_CANCELADA });
        }     
    }

    render() {
        return (
            <div>
                <Modal.Body>
                    Va a cancelar la petición de la evaluación curricular de {this.props.peticion.asignaturaNombre} ({this.props.peticion.asignaturaCodigo}) de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}).
                    <br />
                    <br />
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Check type="radio" label="No cumple requisitos" name="horizontalRadio" onChange={this.handleCheckBox} value = {estadosEvaluacionCurricular.SOLICITUD_CANCELADA} defaultChecked/>                           
                            <Form.Check type="radio" label="El tribunal ha denegado su solicitud" name="horizontalRadio" onChange={this.handleCheckBox} value = {estadosEvaluacionCurricular.EVALUACION_DENEGADA} />
                            <Form.Check type="radio" label="Otro motivo" name="horizontalRadio" onChange={this.handleCheckBox} value = {estadosEvaluacionCurricular.SOLICITUD_CANCELADA} defaultChecked/>                     
                            <Form.Label>Indique motivo de cancelación</Form.Label>
                            <Form.Control onChange={this.handleChangeTextCancel} as="textarea" rows="3" />
                        </Form.Group>
                    </Form >
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
                    <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
                </Modal.Footer>
            </div>
        );
    }
}
