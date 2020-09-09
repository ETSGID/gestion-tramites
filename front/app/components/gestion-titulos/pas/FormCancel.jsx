import React from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
const estadosTitulo = require('../../../../../back/enums').estadosTitulo;

export default class Formcancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { textCancel: "", cancelNewState: estadosTitulo.PETICION_CANCELADA};
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
            case estadosTitulo.ESPERA_TITULO:
                textCancel = "\n\nSu título ha sido solicitado previamente, pero aun no está disponible. Pasará al estado: ESPERA_TITULO.\n\nComentario Secretaría:\n ";
                break;
            case estadosTitulo.TITULO_DISPONIBLE:
                textCancel = "\n\nSu título ha sido solicitado previamente y puede pasar a recogerlo. Pasará al estado: TITULO_DISPONIBLE.\n\nComentario Secretaría:\n ";
                break;
            case estadosTitulo.TITULO_RECOGIDO:
                textCancel = "\n\nSu título ha sido solicitado y recogido previamente. Pasará al estado: TITULO_RECOGIDO.\n\nComentario Secretaría:\n ";
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

        if (ev.currentTarget.value == estadosTitulo.TITULO_RECOGIDO) {
            this.setState({cancelNewState : estadosTitulo.TITULO_RECOGIDO});
        } else if (ev.currentTarget.value == estadosTitulo.ESPERA_TITULO) {
            this.setState({ cancelNewState: estadosTitulo.ESPERA_TITULO});
        } else if (ev.currentTarget.value == estadosTitulo.TITULO_DISPONIBLE) {
            this.setState({ cancelNewState: estadosTitulo.TITULO_DISPONIBLE });
        }   else {
            this.setState({ cancelNewState: estadosTitulo.PETICION_CANCELADA });
        }     
    }

    render() {
        return (
            <div>
                <Modal.Body>
                    Va a cancelar la petición del título del plan {this.props.peticion.planNombre} ({this.props.peticion.planCodigo}) por parte de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}).
                    <br />
                    <br />
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Check type="radio" label="Cancelar petición" name="horizontalRadio" onChange={this.handleCheckBox} value = {estadosTitulo.PETICION_CANCELADA} defaultChecked/>                           
                            ¿Título solicitado previamente?
                            <Form.Check type="radio" label="El título ha sido recogido por el alumno" name="horizontalRadio" onChange={this.handleCheckBox} value = {estadosTitulo.TITULO_RECOGIDO} />
                            <Form.Check type="radio" label="El título aun no ha llegado a secretaría" name="horizontalRadio" onChange={this.handleCheckBox} value = {estadosTitulo.ESPERA_TITULO}/>                           
                            <Form.Check type="radio" label="El título se encuentra disponible para recoger" name="horizontalRadio" onChange={this.handleCheckBox} value = {estadosTitulo.TITULO_DISPONIBLE}/>                           

                            <Form.Label>Indique motivo de cancelación de la petición</Form.Label>
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
