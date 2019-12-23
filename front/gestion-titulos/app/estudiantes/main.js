import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
//IMPORT BOOTSTRAP//
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
//IMPORT REACT-BOOTSTRAP-TABLE//
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import App from '../components/estudiantes/App';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept(App, () => {
    const newApp = require(App).default;
    render(newApp);
  });
}
