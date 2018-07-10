import React, { Component } from 'react';
import './App.css';
import Broken from './Broken';
import ErrorBoundary from './ErrorBoundary';

class App extends Component {
  state = {
    counter: 0
  }

  increment = () => {
    this.setState(prevState => ({ counter: prevState.counter + 1 }));
  }

  decrement = () => {
    this.setState(prevState => ({ counter: prevState.counter - 1 }));
  }

  render() {
    return (
      <div className="App">
        <h1>Hello rails365</h1>
        <ErrorBoundary render={ (error, errorInfo) => (
          <div>
            <p>Error: { error.toString() }</p>
            <p>Error Info: { errorInfo.componentStack }</p>
          </div>
        )}>
          <Broken />
        </ErrorBoundary>

        <div>Counter: { this.state.counter }</div>
        <button onClick={ this.increment }>Increment</button>
        <button onClick={ this.decrement }>Decrement</button>
      </div>
    );
  }
}

export default App;
