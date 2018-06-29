import React, { Component } from 'react';

export default class RecordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      title: "",
      amount: ""
    }
  }

  handleChange(event) {
    let name, obj;
    name = event.target.name;
    // 逗号表达式，结果是最右边的表达式的值
    this.setState((
      obj = {},
      // obj["" + name] = event.target.value,
      obj[name] = event.target.value,
      obj
    ));
  }

  valid() {
    return this.state.date && this.state.title && this.state.amount
  }

  render() {
    return (
      <form className="form-inline mb-3">
        <div className="form- mr-1">
          <input type="date" className="form-control" onChange={this.handleChange.bind(this)} placeholder="Date" name="date" value={this.state.date} />
        </div>
        <div className="form-group mr-1">
          <input type="text" className="form-control" onChange={this.handleChange.bind(this)} placeholder="Title" name="title" value={this.state.title} />
        </div>
        <div className="form-group mr-1">
          <input type="text" className="form-control" onChange={this.handleChange.bind(this)}  placeholder="Amount" name="amount" value={this.state.amount} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.valid()}>Create Record</button>
      </form>
    );
  }
}
