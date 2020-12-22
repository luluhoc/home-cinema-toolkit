import axios from 'axios';
import setAlert from './alert.actions';
import { FIND_MOVIES, START_MOVIES_SEARCH, DELETE_MOVIE, DELETE_MOVIES, GOT_MOVIES_FROM_RADARR, CLEAR_DB, ERROR_GETTING_MOVIES } from './types.actions';


export const findMovies = (formValues, settings) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || settings.addExclusion === undefined || settings.deleteFiles === undefined) {
    return dispatch(setAlert('You must enter the settings', 'error'))
  }
  const body = JSON.stringify(formValues);
  try {
    dispatch({
      type: START_MOVIES_SEARCH,
    });
    await axios.post('/api/movies/radarr', body, config);
    dispatch({
      type: GOT_MOVIES_FROM_RADARR,
    })
    const res = await axios.post('/api/movies', body, config);
    dispatch({
      type: FIND_MOVIES,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    const { errors } = err.response.data;

    if (errors) {
      dispatch({
        type: ERROR_GETTING_MOVIES
      })
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const clearDB = (settings) => async (dispatch) => {
  if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || settings.addExclusion === undefined || settings.deleteFiles === undefined) {
    return dispatch(setAlert('You must enter the settings', 'error'))
  }
  await axios.get('/api/movies/clear-db');
  dispatch({
    type: CLEAR_DB
  });
  dispatch(setAlert(`Rating DB cleared`, 'success'))
}

export const deleteMovie = (movies, settings) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    console.log(settings)
    if (movies?.data?.length === 1) {
      if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || settings.addExclusion === undefined || settings.deleteFiles === undefined) {
        return dispatch(setAlert('You must enter the settings', 'error'));
      }
      const body = JSON.stringify({
        selectedArr: [getState()?.rating?.movies[movies?.data?.[0]?.dataIndex]?.rId],
      });
      const deletedData = await axios.post('/api/movies/delete', body, config);
      dispatch({
        type: DELETE_MOVIE,
        payload: movies?.data[0],
      });
      dispatch(setAlert(`Deleted ${deletedData.data.deleted} movie`, 'success'))
    } else {
      console.log('2')
      const selectedArr = [];
      for (let i = 0; i < movies?.data.length; i++) {
        const e = movies?.data[i];
        selectedArr.push(getState()?.rating?.movies[e?.dataIndex]?.rId)
      }
      if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || settings.addExclusion === undefined || settings.deleteFiles === undefined) {
        return dispatch(setAlert('You must enter the settings', 'error'))
      }
      const body = JSON.stringify({
        selectedArr
      });
      console.log(body)
      const deletedData = await axios.post('/api/movies/delete', body, config)
      console.log(deletedData)
      dispatch({
        type: DELETE_MOVIES,
        payload: selectedArr,
      });
      dispatch(setAlert(`Deleted ${deletedData.data.deleted} movies`, 'success'))
    }
  } catch (err) {
    console.log(err);
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};
