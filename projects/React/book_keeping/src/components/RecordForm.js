import React, { Component } from 'react';

import * as RecordsAPI from '../utils/RecordsAPI';

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

  handleSubmit(event) {
    event.preventDefault();
    const formData = { 
      ...this.state,
      amount: Number.parseInt(this.state.amount, 10)
    };
    RecordsAPI.newRecord(formData).then(
      response => {
        console.log(response);
        this.props.handleNewRecord(response.data);
        this.setState({
          date: "",
          title: "",
          amount: ""
        });
      }
    ).catch(
      error => console.log(error)
    );
  }

  render() {
    return (
      <form className="form-inline mb-3" onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group mr-1">
          <input type="date" className="form-control" placeholder="Date" name="date" value={this.state.date} />
        </div>
        <div className="form-group mr-1">
          <input type="text" className="form-control" placeholder="Title" name="title" value={this.state.title} />
        </div>
        <div className="form-group mr-1">
          <input type="text" className="form-control"  placeholder="Amount" name="amount" value={this.state.amount} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.valid()}>Create Record</button>
      </form>
    );
  }
}
