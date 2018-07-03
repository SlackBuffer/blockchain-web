import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import { addReminder, deleteReminder, clearReminders } from '../actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      duaDate: ''
    };
  }

  addReminder() {
    this.props.addReminder(this.state.text, this.state.duaDate);
  }

  deleteReminder(id) {
    this.props.deleteReminder(id)
  }

  clearReminders() {
    this.props.clearReminders();
  }

  renderReminders() {
    const {reminders} = this.props;
    return (
      <ul className="list-group col-sm-8 mt-2">
        {
          reminders.map(reminder => {
            return (
              <li key={reminder.id} className="list-group-item">
                <div className="list-item">
                  <div>{reminder.text}</div>
                  <div><em>{reminder.duaDate}</em></div>
                  <div><em>{moment(new Date(reminder.duaDate)).fromNow()}</em></div>
                </div>
                <div
                  className="list-item delete-button"
                  onClick={ () => this.deleteReminder(reminder.id) }
                >
                  &#x2715;
                </div>
              </li>
            );
          })
        }
      </ul>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="title">Reminder Pro</div>

        <div className="form-inline">
          <div className="form-group mr-2">
            <input 
              type="text" 
              className="form-control" 
              placeholder="I have to..." 
              onChange={ (event) => this.setState({text: event.target.value})}  
            />
            <input
              type="datetime-local"
              className="form-control"
              onChange={ event => this.setState({duaDate: event.target.value})}
            />
          </div>
          <button 
            type="button" 
            className="btn btn-success"
            onClick={this.addReminder.bind(this)}
          >
            Add Reminder
          </button>
        </div>
        {this.renderReminders()}
        {this.props.reminders.length > 0 && (
          <div 
            className="btn btn-danger mt-3"
            onClick={ () => this.clearReminders() }
          >
            Clear All Reminders
          </div>
        )}
      </div>

    );
  }
}

App.propTypes = {
  reminders: PropTypes.array.isRequired,
  addReminder: PropTypes.func.isRequired,
  deleteReminder: PropTypes.func.isRequired,
  clearReminders: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    reminders: state
  };
};

export default connect(mapStateToProps, { addReminder, deleteReminder, clearReminders })(App);
