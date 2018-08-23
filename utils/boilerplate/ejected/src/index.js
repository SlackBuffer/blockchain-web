import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'babel-polyfill'
import Sirius from 'redux-sirius'
import logger from 'redux-logger'
import registerServiceWorker from 'registerServiceWorker'

import 'styles/index.scss'
import App from 'containers/App'
import count from 'models/count'

const store = new Sirius({
  models: {
    count
  },
  middlewares: [logger]
}).store()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
