import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import PropTypes from 'prop-types'

import 'styles/App.scss'

class App extends Component {
  increment = () => {
    this.props.dispatch({
      type: 'count/increment'
    })
  }

  decrement = () => {
    this.props.dispatch({
      type: 'count/decrement'
    })
  }

  asyncDecrement = () => {
    this.props.dispatch({
      type: 'count/asyncDecrement'
    })
  }

  static propTypes = {
    count: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { count } = this.props
    return (
      <div className="App">
        current count: {count}
        <br />
        <Button type="primary" onClick={this.increment}>
          +
        </Button>
        <br />
        <Button type="ghost" onClick={this.decrement}>
          -
        </Button>
        <br />
        <Button type="dashed" onClick={this.asyncDecrement}>
          async +
        </Button>
        <br />
        <div>abc</div>
        <div>123</div>
      </div>
    )
  }
}

const mapStateToProps = ({ count }) => {
  return { count }
}

export default connect(mapStateToProps)(App)
