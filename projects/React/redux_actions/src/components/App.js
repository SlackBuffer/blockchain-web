import React, { Component } from 'react';
import { connect } from 'react-redux';

import { actionCreators, decrement } from '../actions';
import './App.css';

class App extends Component {
  componentWillMount() {}

  render() {
    // console.log(this.props.state);
    const { increment, decrement, counter } = this.props;
    // console.log('~~~~~', actionCreators.app.counter.increment());
    return (
      <div>
        <button type="button" onClick={() => increment(4)}>
          {counter} +
        </button>
        <button type="button" onClick={() => decrement(3)}>
          -
        </button>
      </div>
    );
  }
}

const { increment } = actionCreators.app.counter;

const mapStateToProps = ({ counter }) => ({
  counter
});

export default connect(
  mapStateToProps,
  { increment, decrement }
)(App);
