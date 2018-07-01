import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as RecordsAPI from '../utils/RecordsAPI';

export default class Record extends Component {
  constructor() {
    super();
    this.state = {
      editting: false
    };
  }

  handeToggleEdit() {
    this.setState({
      editting: !this.state.editting
    });
  }

  handleUpdate() {
    const formData = { 
      date: this.refs.date.value,
      title: this.refs.title.value,
      amount: Number.parseInt(this.refs.amount.value, 10)
    };
    RecordsAPI.updateRecord(this.props.id, formData).then(
      response => {
        this.props.handleUpdateRecords(response.data);
        this.handeToggleEdit();
      }
    ).catch(
      error => {
        console.log(error);
      }
    )
  }

  handleDelete() {
    RecordsAPI.remove(this.props.id).then(
      response => {
        this.props.handleDeleteRecord(response.data);
      }
    ).catch(
      error => console.log(error)
    );
  }

  recordRow() {
    return (
      <tr>
        <td>{this.props.date}</td>
        <td>{this.props.title}</td>
        <td>{this.props.amount}</td>
        <td>
          <button className="btn btn-info mr-1" onClick={this.handeToggleEdit.bind(this)}>Edit</button>
          <button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>Delete</button>
        </td>
      </tr>
    );
  }

  recordForm() {
    return (
      <tr>
        <td>
          <input type="date" className="form-control" defaultValue={this.props.date} ref="date" />
        </td>
        <td>
          <input type="text" className="form-control" defaultValue={this.props.title} ref="title" />
        </td>
        <td>
          <input type="text" className="form-control" defaultValue={this.props.amount} ref="amount" />
        </td>
        <td>
          <button className="btn btn-info mr-1" onClick={this.handeToggleEdit.bind(this)}>Cancle</button>
          <button className="btn btn-danger" onClick={this.handleUpdate.bind(this)}>Update</button>
        </td>
      </tr>
    )
  }

  render() {
    if (this.state.editting) {
      return this.recordForm();
    } else {
      return this.recordRow();
    }
  }
}

Record.propTypes = {
  id: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  amount: PropTypes.number
}
