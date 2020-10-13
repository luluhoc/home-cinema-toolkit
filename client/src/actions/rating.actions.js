import axios from 'axios';
import setAlert from './alert.actions';
import { FIND_MOVIES, START_MOVIES_SEARCH, DELETE_MOVIE, DELETE_MOVIES } from './types.actions';

import returnStoreAndPersistor from '../store';

const { store } = returnStoreAndPersistor();

export const findMovies = (formValues, settings) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb) {
    return dispatch(setAlert('You must enter the settings', 'error'))
  }
  const body = JSON.stringify({
    radarrUrl: settings.radarrUrl,
    radarrApi: settings.radarrApi,
    keyOmdb: settings.keyOmdb,
    v3: settings?.v3,
    desiredRating: formValues.desiredRating,
    addExclusion: formValues.addExclusions,
    deleteFiles: formValues.deleteFiles
  });
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

export const deleteMovie = (movies, formValues, settings) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    if (movies?.data?.length === 1) {
      if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb) {
        return dispatch(setAlert('You must enter the settings', 'error'))
      }
      const body = JSON.stringify({
        radarrUrl: settings.radarrUrl,
        radarrApi: settings.radarrApi,
        keyOmdb: settings.keyOmdb,
        v3: settings?.v3,
        desiredRating: formValues.desiredRating,
        addExclusion: formValues.addExclusion,
        deleteFiles: formValues.deleteFiles,
        selectedArr: [getState()?.rating?.movies[movies?.data?.[0]?.dataIndex]?.rId],
      });
      const deletedData = await axios.post('/api/movies/delete', body, config)
      dispatch({
        type: DELETE_MOVIE,
        payload: movies.data[0],
      });
      console.log(deletedData)
      dispatch(setAlert(`Deleted ${deletedData.data.deleted} movie`, 'success'))
    } else {
      console.log('2')
      const selectedArr = [];
      for (let i = 0; i < movies?.data.length; i++) {
        const e = movies?.data[i];
        selectedArr.push(getState()?.rating?.movies[e?.dataIndex]?.rId)
      }
      if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb) {
        return dispatch(setAlert('You must enter the settings', 'error'))
      }
      const body = JSON.stringify({
        radarrUrl: settings.radarrUrl,
        radarrApi: settings.radarrApi,
        keyOmdb: settings.keyOmdb,
        v3: settings?.v3,
        desiredRating: formValues.desiredRating,
        addExclusions: formValues.addExclusion,
        deleteFiles: formValues.deleteFiles,
        selectedArr
      });
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
