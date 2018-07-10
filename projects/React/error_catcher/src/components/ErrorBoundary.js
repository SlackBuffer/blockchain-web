import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ]).isRequired
  }

  state = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return <div>{ this.props.render(this.state.error, this.state.errorInfo) }</div>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
