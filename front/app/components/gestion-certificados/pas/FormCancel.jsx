import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default class Formcancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { textCancel: "" }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTextCancel = this.handleChangeTextCancel.bind(this);
    }

    handleChangeTextCancel(e) {
        this.setState({ textCancel: e.currentTarget.value })
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.textCancel.trim() == "") {
            alert("Debe indicar el motivo por el que se cancela la petición de certificado académico");
        } else {
            let paramsToUpdate = {
                textCancel : this.state.textCancel.trim()
            }
            this.props.cambioEstadoClick(paramsToUpdate)
        }
    }
    render() {
        return (
            <div>
                <Modal.Body>
                    Va a cancelar la petición del certificado académico solicitado el día {this.props.peticion.fecha} por parte de {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}).
                    <br />
                    <br />
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Indique motivo de cancelación de la petición de certificado académico</Form.Label>
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
