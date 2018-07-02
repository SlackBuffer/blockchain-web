import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { increment, decrement } from '../actions';
import * as actions from '../actions';
import User from './User.js';

class App extends Component {
  // 不传 mapDispatchToProps
  /* render() {
    const { dispatch } = this.props;
    return (
      <div className="container">
        <h1 className="jumbotron-heading text-center">{this.props.counter}</h1>
        <p className="text-center">
          <button onClick={ () => dispatch(increment()) } className="btn btn-primary mr-2">Increase</button>
          <button onClick={ () => dispatch(decrement()) } className="btn btn-danger my-2">Decrease</button>
        </p>
      </div>
    );
  } */
  render() {
    const { increment, decrement } = this.props;
    return (
      <div className="container">
        <h1 className="jumbotron-heading text-center">{this.props.counter}</h1>
        <p className="text-center">
          <button onClick={ increment } className="btn btn-primary mr-2">Increase</button>
          <button onClick={ decrement } className="btn btn-danger my-2">Decrease</button>
        </p>
        <User />
      </div>
    );
  }
}

// 此处 state 即 store.getState() 的值
const mapStateToProps = (state) => {
  return {
    counter: state.counter
  };
};

// 穿入 mapDispatchToProps
/* var mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement())
  };
};

var mapDispatchToProps = (dispatch) => {
  return {
    increment: bindActionCreators(increment, dispatch),
    decrement: bindActionCreators(decrement, dispatch)
  };
};
var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ increment, decrement }, dispatch);
}; 
// action 巨多时这样写可以简化
var mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
}; 
*/

App.propTypes = {
  counter: PropTypes.number.isRequired
};

export default connect(mapStateToProps, { increment, decrement })(App);
// export default connect(mapStateToProps, mapDispatchToProps)(App);

// 直接传递 store 给 App
/* 
class App extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="jumbotron-heading text-center">{this.props.store.getState()}</h1>
        <p className="text-center">
          <button className="btn btn-primary mr-2">Increase</button>
          <button className="btn btn-danger my-2">Decrease</button>
        </p>
      </div>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
};
export default App;
 */

// context 写法
/* 
class App extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="jumbotron-heading text-center">{this.context.store.getState()}</h1>
        <p className="text-center">
          <button className="btn btn-primary mr-2">Increase</button>
          <button className="btn btn-danger my-2">Decrease</button>
        </p>
      </div>
    );
  }
}

App.contextTypes = {
  store: PropTypes.object
};

export default App;
 */

// just redux
/* 
class App extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="jumbotron-heading text-center">{this.props.value}</h1>
        <p className="text-center">
          <button onClick={this.props.onIncrement} className="btn btn-primary mr-2">Increase</button>
          <button onClick={this.props.onDecrement} className="btn btn-danger my-2">Decrease</button>
        </p>
      </div>
    );
  }
}
export default App;
*/
