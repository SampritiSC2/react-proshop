import React from 'react';
import ReactDOM from 'react-dom/client';
// import './assets/styles/bootstrap.custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PayPalScriptProvider deferLoading={true}>
      <App />
    </PayPalScriptProvider>
  </Provider>
  // </React.StrictMode>
);
