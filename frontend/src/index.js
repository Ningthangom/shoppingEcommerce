import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider } from 'react-redux'
import store from './store'

// for Alert
import { positions, transitions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

//5 seconds
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE
}



ReactDOM.render(
  <Provider store={store}>
      {/* alert component*/}
      <AlertProvider template={AlertTemplate} {...options}>
    {/* app component*/}
          <App />
      </AlertProvider>
  </Provider>,
  document.getElementById('root')
);

