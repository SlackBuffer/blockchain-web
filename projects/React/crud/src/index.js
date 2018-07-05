import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import './index.css';
import App from './components/App';
import GamePage from './components/GamePage';
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
    <Router>
      <div className="ui container">
        <div className="ui three item menu">
          <NavLink exact activeClassName="active" className="item" to="/">
            Home
          </NavLink>
          <NavLink exact activeClassName="active" className="item" to="/games">
            Games
          </NavLink>
          <NavLink activeClassName="active" className="item" to="/games/new">
            Add New Game
          </NavLink>
        </div>
        <Route exact path="/" component={App} />
        <Route exact path="/games" component={GamePage} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    ReactDOM.render(
      <Provider store={store}>
        <Router>
          <div className="ui container">
            <div className="ui three item menu">
              <NavLink exact activeClassName="active" className="item" to="/">
                Home
              </NavLink>
              <NavLink
                exact
                activeClassName="active"
                className="item"
                to="/games"
              >
                Games
              </NavLink>
              <NavLink
                activeClassName="active"
                className="item"
                to="/games/new"
              >
                Add New Game
              </NavLink>
            </div>
            <Route exact path="/" component={App} />
            <Route exact path="/games" component={GamePage} />
          </div>
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  });
}

// registerServiceWorker();
