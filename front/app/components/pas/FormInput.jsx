import React from 'react';
import { Button, Form } from 'react-bootstrap';

export default class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    event.preventDefault();
    if (!this.fileInput.current.files[0]) {
      alert("Debe adjuntar la carta de pago");
    }else{
      this.props.cambioEstadoClick(this.props.index)
    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Button className="d-inline" type="submit">Enviar</Button>
        <input type="file" ref={this.fileInput}/>
      </Form>
    );
  }
}