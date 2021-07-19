import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
//IMPORT BOOTSTRAP//
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
//IMPORT REACT-BOOTSTRAP-TABLE//
import '../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
const tramite = process.env.TRAMITE || 'gestionTitulos';
const tramites = require('../../../back/enums').tramites;


let App = require(`../components/${tramites[tramite][0]}/estudiantes`).app;


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
