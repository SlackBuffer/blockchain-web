import React, { Component } from 'react'

// js 分片
export default function asyncLoadComponent(importComponent) {
  class AsyncLoadedComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        component: null
      }
    }

    componentDidMount() {
      importComponent().then(mod => {
        this.setState({
          component: mod.default ? mod.default : mod
        })
      })
    }

    render() {
      const C = this.state.component
      return C ? <C {...this.props} /> : null
    }
  }
  return AsyncLoadedComponent
}
