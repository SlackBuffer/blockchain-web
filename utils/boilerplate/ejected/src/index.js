import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'babel-polyfill'
import Sirius from 'redux-sirius'
import logger from 'redux-logger'
import {
  ConnectedRouter,
  routerMiddleware as RouterMiddleware
} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
// import registerServiceWorker from 'registerServiceWorker'

import Router from 'containers/Routes'
import 'styles/index.scss'
/* import count from 'models/count'
import request from 'models/request' */
import rootModal from 'models'

const history = createHistory()
const routerMiddleware = RouterMiddleware(history)

let mode = process.env.NODE_ENV // eslint-disable-line no-undef
let store

if (mode == 'development') {
  store = new Sirius({
    models: {
      ...rootModal
    },
    middlewares: [logger, routerMiddleware]
  }).store()
} else {
  store = new Sirius({
    models: {
      ...rootModal
    },
    middlewares: [routerMiddleware]
  }).store()
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
// registerServiceWorker()
