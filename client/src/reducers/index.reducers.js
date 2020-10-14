import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import rating from './rating.reducers';
import settings from './settings.reducers';
import byage from './byage.reducers';
import tasks from './tasks.reducers';

export default combineReducers({
  rating,
  settings,
  byage,
  tasks,
  form: formReducer,
});
