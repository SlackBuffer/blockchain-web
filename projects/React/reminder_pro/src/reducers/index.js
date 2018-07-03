import { bake_cookie, read_cookie } from 'sfcookies';

import { ADD_REMINDER, DELETE_REMINDER, CLEAR_REMINDERS } from '../constants';

const fmtReminder = action => {
  const {text, duaDate} = action;
  return {
    text,
    duaDate,
    id: Math.random()
  }
}

const reminders = (state = read_cookie('reminders') || [], action = {}) => {
  let reminders;
  switch (action.type) {
    case ADD_REMINDER:
      reminders = [
        ...state,
        fmtReminder(action)
      ];
      bake_cookie('reminders', reminders);
      return reminders;
    case DELETE_REMINDER:
      reminders = state.filter(reminder => reminder.id !== action.id );
      bake_cookie('reminders', reminders);
      return reminders;
    case CLEAR_REMINDERS:
      reminders = [];
      bake_cookie('reminders', reminders);
      return reminders;
    default: return state;
  }
};

export default reminders;
