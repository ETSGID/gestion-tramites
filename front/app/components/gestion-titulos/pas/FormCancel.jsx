import React from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
const estadosTitulo = require('../../../../../back/code/enums').estadosTitulo;

export default class Formcancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { textCancel: "" }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTextCancel = this.handleChangeTextCancel.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);

    }

    handleChangeTextCancel(e) {
        this.setState({ textCancel: e.currentTarget.value })
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.textCancel.trim() == "") {
            alert("Debe indicar el motivo por el que se cancela la petición");
        } else {
            let paramsToUpdate = {
                textCancel : this.state.textCancel.trim()
            }
            this.props.cambioEstadoClick(paramsToUpdate)
        }
    }
    handleCheckBox (ev) {
        if (ev.currentTarget.value == estadosTitulo.TITULO_RECOGIDO) {
            this.setState({ textCancel: "Su título ha sido solicitado y recogido previamente pasa al estado: TITULO_RECOGIDO." });
            this.props.cambioSelectedClick(estadosTitulo.TITULO_RECOGIDO, false, false);
            this.props.cambioEstadoClick(paramsToUpdate);


        } else if (ev.currentTarget.value == estadosTitulo.ESPERA_TITULO) {
            this.setState({ textCancel: "Su título ha sido solicitado previamente pasa al estado: ESPERA_TITULO." });
 

        } else if (ev.currentTarget.value == estadosTitulo.TITULO_DISPONIBLE) {
            this.setState({ textCancel: "Su título ha sido solicitado previamente y se encuentra disponible, pasa al estado: TITULO_DISPONIBLE." });
           
        
        }
    }

    render() {
        return (
            <div>
                <Modal.Body>
                    Va a cancelar la petición del título del plan {this.props.peticion.planCodigo} por parte de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}).
                    <br />
                    <br />
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            ¿Título solicitado previamente?
                            <Form.Check type="checkbox" label="Título recogido" onChange={this.handleCheckBox} value = {estadosTitulo.TITULO_RECOGIDO}/>
                            <Form.Check type="checkbox" label="Espera título" onChange={this.handleCheckBox} value = {estadosTitulo.ESPERA_TITULO}/>                           
                            <Form.Check type="checkbox" label="Título disponible" onChange={this.handleCheckBox} value = {estadosTitulo.TITULO_DISPONIBLE}/>                           

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
