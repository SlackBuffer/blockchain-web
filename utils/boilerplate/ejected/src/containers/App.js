import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        <button onClick={this.increment}>+</button><br />
        <button onClick={this.decrement}>-</button><br />
        <button onClick={this.asyncDecrement}>async +</button><br />
      </div>
    );
  }
}

const mapStateToProps = ({count}) => {
  return {count};
};

export default connect(mapStateToProps)(App);
