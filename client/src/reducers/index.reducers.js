import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import rating from './rating.reducers';
import settings from './settings.reducers';
import byage from './byage.reducers';
import tasks from './tasks.reducers';
import lib from './lib.reducers';

export default combineReducers({
  rating,
  settings,
  byage,
  tasks,
  lib,
  form: formReducer,
});
