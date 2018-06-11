import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './components/App';
import './style/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerServiceWorker from './utility/registerServiceWorker';
import Api from './services/Api'

const store = createStore(reducer);

const api = new Api({ url: 'https://bhtwey7kwc.execute-api.eu-west-3.amazonaws.com/alpha' });

const options = { api }
 
render(
  <Provider store={store}>
    <App options={options} state={store.getState()} />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();