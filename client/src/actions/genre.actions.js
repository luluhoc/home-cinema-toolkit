import axios from 'axios';
import setAlert from './alert.actions';
import {
  FIND_MOVIES, START_MOVIES_SEARCH, GOT_MOVIES_FROM_RADARR, ERROR_GETTING_MOVIES,
} from './types.actions';

export const findMovies = (formValues, settings) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || settings.addExclusion === undefined || settings.deleteFiles === undefined) {
    return dispatch(setAlert('You must enter the settings', 'error'));
  }
  const body = JSON.stringify(formValues);
  try {
    dispatch({
      type: START_MOVIES_SEARCH,
    });
    await axios.post('/api/movies/radarr', body, config);
    dispatch({
      type: GOT_MOVIES_FROM_RADARR,
    });
    const res = await axios.post('/api/movies', body, config);
    dispatch({
      type: FIND_GENRE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    const { errors } = err.response.data;

    if (errors) {
      dispatch({
        type: ERROR_GETTING_MOVIES,
      });
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};
