import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import './index.css';
import App from './components/App';
import rootReducer from './reducers';
import rootSaga from './sagas';
// import registerServiceWorker from './registerServiceWorker';

const sagaMiddleware = createSagaMiddleware();

let store;
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(logger, sagaMiddleware))
  );
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }
} else {
  store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
}

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  });
}

// registerServiceWorker();
