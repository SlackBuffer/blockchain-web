import React, { Component } from 'react';
import { connect } from 'react-redux';

import { get_user } from '../actions';

class User extends Component {
  render() {
    const { isFetching, error, user } = this.props.user;
    let data;
    if (error) {
      data = error;
    } else if (isFetching) {
      data = "Loading...";
    } else { 
      data = user.email;
    }
    return (
      <div>
        <h1 className="jumbotron-heading text-center">{data}</h1>
        <p className="text-center">
          <button onClick={ this.props.get_user } className="btn btn-success mr-2">GET RANDOM USER</button>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, {get_user})(User);
