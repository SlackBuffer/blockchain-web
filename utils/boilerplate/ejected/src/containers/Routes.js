import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import asyncImportComponent from 'utils/asyncLoadComponent'

const AsyncLoadedApp = asyncImportComponent(() => import('./App'))

class Routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={AsyncLoadedApp} />
        </Switch>
      </Router>
    )
  }
}

export default hot(module)(Routes) // eslint-disable-line no-undef
