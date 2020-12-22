import axios from 'axios';
import setAlert from './alert.actions';
import { SET_SETTINGS, GET_SETTINGS, NO_SETTINGS } from './types.actions';

export const setSettings = (formValues) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(formValues);
  try {
    const res = await axios.post('/api/settings', body, config);
    dispatch({
      type: SET_SETTINGS,
      payload: res.data,
    });
    dispatch(setAlert('Settings Saved', 'success'));
  } catch (err) {
    console.log(err);
    if (err && err.response && err.response.data && err.response.data.errors) {
      const { errors } = err.response.data;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
    }
  }
};

export const getSettings = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/settings');
    if (res.data === null) {
      return dispatch({
        type: NO_SETTINGS,
      });
    }
    dispatch({
      type: GET_SETTINGS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err && err.response && err.response.data && err.response.data.errors) {
      const { errors } = err.response.data;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
    }
  }
};
