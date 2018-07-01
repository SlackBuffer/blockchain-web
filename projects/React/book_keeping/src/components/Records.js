import React, { Component } from 'react';
// import { getJSON } from 'jquery';

import Balance from './Balance';
import Record from './Record';
import RecordForm from './RecordForm';
import * as RecordsAPI from '../utils/RecordsAPI';

class Records extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      records: []
    }
  }

  componentDidMount() {
    /* // jQuery way
    getJSON('http://5af71a21c222a90014dbda4f.mockapi.io/api/v1/records').then(
      response => this.setState({ 
        records: response,
        isLoaded: true
      }),
      error => this.setState({
        isLoaded: true,
        error
      })
    ); */

    RecordsAPI.getAllRecords().then(
      response => this.setState({
        records: response.data,
        isLoaded: true
      })
    ).catch(
      error => this.setState({
        isLoaded: true,
        error
      })
    );
  }

  addRecord(record) {
    this.setState({
      isLoaded: true,
      error: null,
      records: [
        record,
        ...this.state.records
      ]
    });
  }

  updateRecords(data) {
    const newRecords = this.state.records.map((item) => {
      if (item.id !== data.id) {
        return item;
      }
      return {
        ...item,
        ...data
      };
    });
    this.setState({
      records: newRecords
    });
  }

  deleteRecord(data) {
    const newRecords = this.state.records.filter( item => item.id !== data.id);
    this.setState({
      records: newRecords
    });
  }

  calcCredit() {
    let r = this.state.records.filter(item => item.amount >= 0);
    if (r.length === 0) {
      return 0;
    }
    return r.reduce((accumulator, currentValue) => {
      return accumulator + Number.parseInt(currentValue.amount, 10);
    }, 0);
  }
  
  calcDebt() {
    let r = this.state.records.filter(item => item.amount < 0);
    if (r.length === 0) {
      return 0;
    }
    return r.reduce((accumulator, currentValue) => {
      return accumulator + Number.parseInt(currentValue.amount, 10);
    }, 0);
  }

  calcBalance() {
    return this.calcCredit() + this.calcDebt();
  }

  render() {
    const { error, isLoaded, records } = this.state;
    let recordsCmp;
    if (error) {
      // return <div>Error: { error.responseText }</div>
      recordsCmp = <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      recordsCmp = <div>Loading</div>
    } else {
      recordsCmp = (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => 
                (<Record 
                  handleUpdateRecords={this.updateRecords.bind(this)}
                  handleDeleteRecord={this.deleteRecord.bind(this)}
                  key={record.id} 
                  {...record} 
                />)
              )}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div>
        <h2>Records</h2>
        <div className="row mb-3">
          <Balance text="Credit" type="success" doMath={this.calcCredit.bind(this)} />
          <Balance text="Debt" type="danger" doMath={this.calcDebt.bind(this)} />
          <Balance text="Balance" type="info" doMath={this.calcBalance.bind(this)} />
        </div>
        <RecordForm handleNewRecord={this.addRecord.bind(this)} />
        {recordsCmp}
      </div>
    )
  }
}

export default Records;
