import React, { Component } from 'react';
// import { getJSON } from 'jquery';
import axios from 'axios';

import RecordForm from './RecordForm';
import Record from './Record';
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

    axios.get(`${RecordsAPI.api}/api/v1/records`).then(
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
              </tr>
            </thead>
            <tbody>
              {records.map((record) => <Record key={record.id} {...record} />)}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div>
        <h2>Records</h2>
        <RecordForm />
        {recordsCmp}
      </div>
    )
  }
}

export default Records;
