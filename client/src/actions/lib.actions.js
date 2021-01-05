/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import setAlert from './alert.actions';
import { GET_ALL_MOVIES, START_ALL_MOVIES_SEARCH, WHITELIST } from './types.actions';

export const getAllMovies = (settings) => async (dispatch) => {
  // if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || settings.addExclusion === undefined || settings.deleteFiles === undefined) {
  //   return dispatch(setAlert('You must enter the settings', 'error'));
  // }
  try {
    dispatch({
      type: START_ALL_MOVIES_SEARCH,
    });
    const res = await axios.get('/api/lib/');
    dispatch({
      type: GET_ALL_MOVIES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const whitelist = (rId) => async (dispatch) => {
  try {
    const body = JSON.stringify({ movie: rId });
    const res = await axios.post('/api/lib/whitelist', body);
    dispatch({
      type: WHITELIST,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};
