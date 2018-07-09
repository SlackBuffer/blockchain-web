import React from 'react';

import money from './images/money-bag.svg';

export default class Root extends React.Component {
  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <img src={ money } alt="money" height="50" />
        <h1>Hello React!!!</h1>
      </div>
    );
  }
}