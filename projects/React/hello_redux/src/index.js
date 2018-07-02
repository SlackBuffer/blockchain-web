import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import './index.css';
import App from './components/App';
import rootReducer from './reducers';
import rootSaga from './sagas';

// import { increment, decrement } from './actions';
// import registerServiceWorker from './registerServiceWorker';

/* const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};
// const logger = function(store) {
//   return function(next) {
//     return function(action) {
//       console.log('dispatching', action);
//       let result = next(action);
//       console.log('next state', store.getState());
//       return result;
//     }
//   }
// }
const error = store => next => action => {
  try {
    next(action)
  } catch(e) {
    console.log('error ' + e);
  }
};

const store = createStore(rootReducer, applyMiddleware(logger, error)); */

const sagaMiddleware = createSagaMiddleware();

/*
// const store = createStore(rootReducer, applyMiddleware(logger, thunk)); 
const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(logger, thunk, sagaMiddleware))
);  */

let store;
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(logger, sagaMiddleware)
    )
  );
  if (module.hot) {
    module.hot.accept('./reducers', ()=> {
      store.replaceReducer(rootReducer)
    })
  }
} else {
  store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
}

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>, 
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    ReactDOM.render(
      <Provider store={ store }>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  })
}

// 直接传递 store 给 App
/* 
ReactDOM.render(
  <Provider store={ store }>
    <App 
      onIncrement={() => store.dispatch(increment())}
      onDecrement={() => store.dispatch(decrement())}
      store={ store }
    />
  </Provider>, 
  document.getElementById('root')
);
 */

// context 写法
/* 
ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>, 
  document.getElementById('root')
);
 */

// just redux
/* 
const store = createStore(reducer);

const render = () => {
  ReactDOM.render(
    <App 
    onIncrement={() => store.dispatch(increment())}
    onDecrement={() => store.dispatch(decrement())}
    value={store.getState()}
    />, 
    document.getElementById('root')
  );
};
render();

store.subscribe(render);
*/

// registerServiceWorker();
