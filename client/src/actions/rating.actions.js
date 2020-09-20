import axios from 'axios';
import setAlert from './alert.actions';
import { FIND_MOVIES, START_MOVIES_SEARCH, DELETE_MOVIE } from './types.actions';

export const findMovies = (formValues) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(formValues);
  try {
    dispatch({
      type: START_MOVIES_SEARCH,
    });
    const res = await axios.post('/api/movies', body, config);
    dispatch({
      type: FIND_MOVIES,
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

export const deleteMovie = (movies) => async (dispatch) => {
  try {
    console.log(movies);
    if (movies && movies.data && movies.data.length === 1) {
      dispatch({
        type: DELETE_MOVIE,
        payload: movies.data[0],
      });
    }
  } catch (err) {
    console.log(err);
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};
