import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import 'styles/App.scss';

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

  render() {
    const { count } = this.props;
    return (
      <div className="App">
        current count: {count}<br />
        <Button onClick={this.increment}>+</Button><br />
        <Button onClick={this.decrement}>-</Button><br />
        <Button onClick={this.asyncDecrement}>async +</Button><br />
      </div>
    );
  }
}

const mapStateToProps = ({count}) => {
  return {count};
};

export default connect(mapStateToProps)(App);
