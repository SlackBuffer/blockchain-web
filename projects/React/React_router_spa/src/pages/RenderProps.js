import React from 'react';
import PropTypes from 'prop-types';

class Mouse extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  }

  state = { x: 0, y: 0 }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }

  render() {
    console.log(this.props.render);
    return (
      <div style={{ height: '100%' }} onMouseMove={ this.handleMouseMove }>
        { this.props.render(this.state) }
      </div>
    )
  }
}

const Position = ({ x, y }) => {
  return (
    <h1>The mouse position is ({ x }, { y })</h1>
  )
}

const App = () => {
  return (
    <div style={{ height: '100%' }}>
      <Mouse render={(props) => <Position { ...props } />} />
      <Mouse render={({x, y}) => (<p>The mouse position is ({ x }, { y })</p>)} />
    </div>
  )
}

export default App;


/* import React from 'react';

const withMouse = (Component) => {
  return class extends React.Component {
    state = { x: 0, y: 0 }

    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      })
    }

    render() {
      return (
        <div style={{ height: '100%' }} onMouseMove={ this.handleMouseMove }>
          <Component { ...this.props } mouse={ this.state }/>
        </div>
      )
    }
  }
}

const App = (props) => {
  const { x, y } = props.mouse
  return (
    <div style={{ height: '100%' }}>
      <h1>The mouse position is ({ x }, { y })</h1>
    </div>
  )
}

const AppWithMouse = withMouse(App)
export default AppWithMouse;
 */