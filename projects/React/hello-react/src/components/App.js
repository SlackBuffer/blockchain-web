import React, { Component } from 'react';

import Home from './Home';
import Header from './Header';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      homeLink: "Home",
      homeMounted: true
    };
    console.log('Mounting: constructor()');
  }

  onGreet(age) {
    alert(age);
  }

  onChangeLinkName(newName) {
    this.setState({
      homeLink: newName
    });
  }

  onToggleHomeMountStatus() {
    this.setState({
      homeMounted: !this.state.homeMounted
    });
  }

  render() {
    console.log('render()');
    const user = {
      name: "Anna",
      hobbies: ["Sports", "Reading"]
    };

    let homeComponent = '';
    if (this.state.homeMounted) {
      homeComponent = (
        <Home
          name={'max'}
          age={12}
          user={user}
          greet={this.onGreet}
          changeLink={this.onChangeLinkName.bind(this)}
          linkName={this.state.homeLink}>
          <p>I'm a child</p>
        </Home>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-1 col-xs-offset-11">
            <Header homeLink={this.state.homeLink} />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-1 col-xs-offset-11">
            <h1>Hello</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-1 col-xs-offset-11">
            {homeComponent}
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col-xs-1 col-xs-offset-11">
            <button onClick={this.onToggleHomeMountStatus.bind(this)} className="btn btn-primary">(Un)mount Home component</button>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
