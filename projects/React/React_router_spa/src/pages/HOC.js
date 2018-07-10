import React, { Component } from 'react';

import User from '../components/User';
import Joke from '../components/Joke';

// return 的组件是接受 <Hello name="hofungkoeng" /> 传递的 props 的组件 

const withName = WrappedComponent => {
  return class extends Component {
    render() {
      // console.log(this.props);
      return <WrappedComponent { ...this.props } />
    }
  }
}

const WithMulty = (props) => {
  console.log(props);
  return props.children;
};

const WrappedComponent = props => {
  return <p>Hello {props.name}</p>
};

const Hello = withName(WrappedComponent);

class HOC extends Component {
  render() {
    console.log(this.props);
    return (
      <WithMulty>
        <Hello name="hofungkoeng" />
        <User />
        <Joke />
      </WithMulty>
    );
  }
}

export default HOC;
