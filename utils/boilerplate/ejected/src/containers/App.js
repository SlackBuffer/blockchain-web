import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import imgs from 'utils/imgs'

import 'styles/App.scss'

class App extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'request/userInfo'
    })
  }

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
    count: PropTypes.shape({
      count: PropTypes.number.isRequired
    }).isRequired,
    request: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      userName: PropTypes.string,
      userEmail: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { isLoading, userName, userEmail } = this.props.request
    const { count } = this.props.count
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
          async -
        </Button>
        <br />
        <h2>{isLoading && 'Loading...'}</h2>
        <h2>{userName && userName}</h2>
        <h2>{userEmail && userEmail}</h2>
        <img src={imgs.eslint} alt="" />
      </div>
    )
  }
}

const mapStateToProps = ({ count, request }) => {
  return { count, request }
}

export default connect(mapStateToProps)(App)
