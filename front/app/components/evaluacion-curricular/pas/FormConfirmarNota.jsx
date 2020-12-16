import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


export default class FormConfirmarNota extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textCancel: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
       }

    handleSubmit() {
        this.props.cambioEstadoClick();
    }

render() {
    return (
        <div>
            <Modal.Body>
                Va a confirmar que la nota de la evaluación curricular ha sido actualizada en el expediente del alumno. Este podrá consultarla ya en Politécnica Virtual.
                    <br />
                <br />
                <Form onSubmit={this.handleSubmit}>
                </Form >
            </Modal.Body>
            <Modal.Footer>
               <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
            </Modal.Footer>
        </div>
    );
}
}
