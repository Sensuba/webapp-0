import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './style/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerServiceWorker from './utility/registerServiceWorker';
import Api from './services/Api'

const api = new Api({ url: 'https://tafxxjveib.execute-api.us-east-1.amazonaws.com/production' });

const options = { api }
 
render(
  <App options={options} />,
  document.getElementById('root')
)
registerServiceWorker();