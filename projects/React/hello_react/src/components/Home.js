import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Home extends Component {
  constructor(props) {
    super(props);
    // 初始化时执行构造函数，props 传入的初始值显示在页面上
    this.state = {
      age: props.age,
      status: 0,
      homeLink: props.linkName
    };
    // 这里会使得 updaing 的生命周期函数延时二次调用（延时）
    setTimeout(() => {
      this.setState({
        status: 1
      })
    }, 3000);
  }

  onMakeOlder() {
    this.setState({
      age: this.state.age + 3
    });
    console.log(this);
  }

  // Home（子组件）向 App（父组件）传值
  handleGreet() {
    this.props.greet(this.state.age);
  }

  // Home 向 Header 传值（兄弟节点之间）
  onChangeLink() {
    this.props.changeLink(this.state.homeLink);
  }

  onHandleChange(event) {
    this.setState({
      homeLink: event.target.value
    });
    this.props.changeLink(event.target.value);
    console.log('~~~~' + this.state.homeLink);  // 此时 setState 尚未生效，要等 setState 所在的函数执行完毕才生效
  }

  static getDerivedStateFromProps(props, state) {
    console.log('Mounting: getDerivedStateFromProps()');
    return null;
  }

  componentDidMount() {
    console.log('Mounting: componentDidMount()');
  }

  render() {
    console.log('render');
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-1 col-xs-offset-11">
            <div>Your name is {this.props.name}, your age is {this.state.age}</div>
            <p>Status: {this.state.status}</p>
            <button onClick={ () => { this.onMakeOlder() }} className="btn btn-primary">Make me older</button>
            <hr />
            <button onClick={ this.handleGreet.bind(this) } className="btn btn-primary">Greet</button>
            <hr />
            <input
              type="text"
              defaultValue={ this.props.linkName }
              value={ this.state.homeLink }
              onChange={ event => this.onHandleChange(event) }
            />
            <button onClick={ this.onChangeLink.bind(this) } className="btn btn-primary">Change Header Link</button>
            <div>
              <h4>hobbies</h4>
              <ul>
                { this.props.user.hobbies.map((hobby, i) => <li key={i}>{hobby}</li>)}
              </ul>
            </div>
            <div>{ this.props.children }</div>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  user: PropTypes.object,
  children: PropTypes.element.isRequired,
  greet: PropTypes.func,
  changeLink: PropTypes.func,
  linkName: PropTypes.string
};
