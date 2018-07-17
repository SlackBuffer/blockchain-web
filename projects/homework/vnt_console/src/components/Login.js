import React, { Component } from 'react';
import { Button, Checkbox } from 'antd';
// import CommonInput from '../components/CommonInput';

// import './myLogin.css';

class Login extends Component {
  render() {
    return (
      <div className="login-container">
        <div className="login-header">
          <img className="login-header__logo" src={require('../assets/img/login-logo.png')} alt="" />
        </div>
        <div className="login-form">

        </div>
        <div className="login-footer">
            <p>COPYRIGHT © 2018 VNTCHAIN.IO All RIGHTS RESERVED</p>
          </div>
      </div>
    )
  }
}

export default Login;
