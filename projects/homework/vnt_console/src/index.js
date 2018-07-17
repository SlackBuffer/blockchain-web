import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  ConnectedRouter,
  routerMiddleware as RouterMiddleware
} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';


import './styles/main.css';
import App from './components/App';
import rootReducer from './reducers';
import rootSaga from './sagas';
// import registerServiceWorker from './registerServiceWorker';

import router from './router';
const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routerMiddleware = RouterMiddleware(history);

let store;
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(logger, routerMiddleware, sagaMiddleware))
  );
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }
} else {
  store = createStore(rootReducer, applyMiddleware(routerMiddleware, sagaMiddleware));
}

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>{router}</ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./router', () => {
    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>{router}</ConnectedRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
}

// registerServiceWorker();
