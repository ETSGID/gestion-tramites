import React from 'react';
import  {Modal, Button} from 'react-bootstrap';

export default class FormFinalizar extends React.Component {
    constructor(props) {
        super(props);
       this.handleSubmit = this.handleSubmit.bind(this);
    }

 
    handleSubmit(event) {
        event.preventDefault();
        let paramsToUpdate = {}
        this.props.cambioEstadoClick(paramsToUpdate)
    }

       
    render() {
        return (
            <div>
              <Modal.Body>
                Asegúrese de que el alumno ha obtenido el email de confirmación antes de finalizar el proceso.
              </Modal.Body>
              <Modal.Footer>
                {/* <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button> */}
                <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
              </Modal.Footer>
            </div>
        );
    }
}
