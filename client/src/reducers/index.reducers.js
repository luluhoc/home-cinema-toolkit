import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import rating from './rating.reducers';
import settings from './settings.reducers';

export default combineReducers({
  rating,
  settings,
  form: formReducer,
});
