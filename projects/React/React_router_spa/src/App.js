import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Footer from './components/Footer';
import Jumbotron from './components/Jumbotron';
import Navbar from './components/Navbar';
import HOC from './pages/HOC';
import Context from './pages/Context';
import RenderProps from './pages/RenderProps';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Jumbotron title="Welcome" subtitle="put something witty here" />
          <Route exact path="/" component={Home} />
          <Route path="/contact/:id" component={Contact} />
          <Route path="/about" component={About} />
          <Route path="/hoc" component={HOC} />
          <Route path="/context" component={Context} />
          <Route path="/renderp" component={RenderProps} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
