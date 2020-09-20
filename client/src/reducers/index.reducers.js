import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import rating from './rating.reducers';

export default combineReducers({
  rating,
  form: formReducer,
});
