/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import setAlert from './alert.actions';
import {
  START_BY_AGE, FIND_MOVIES_BY_AGE, DELETE_MOVIE, DELETE_MOVIES
} from './types.actions';

import returnStoreAndPersistor from '../store';

const { store } = returnStoreAndPersistor();

export const findByDate = (formValues, settings) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  dispatch({
    type: START_BY_AGE,
  });
  if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || !settings.v3) {
    return dispatch(setAlert('You must enter the settings', 'error'));
  }
  const body = JSON.stringify({
    radarrUrl: settings.radarrUrl,
    radarrApi: settings.radarrApi,
    keyOmdb: settings.keyOmdb,
    v3: settings.v3,
    date: formValues.date,
  });
  try {
    const res = await axios.post('/api/by-age', body, config);
    dispatch({
      type: FIND_MOVIES_BY_AGE,
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

export const deleteMovie = (movies, formValues) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const { settings } = store.getState();
  try {
    console.log(movies);
    if (movies?.data?.length === 1) {
      if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || !settings.v3) {
        return dispatch(setAlert('You must enter the settings', 'error'))
      }
      const body = JSON.stringify({
        radarrUrl: settings.radarrUrl,
        radarrApi: settings.radarrApi,
        keyOmdb: settings.keyOmdb,
        v3: settings.v3,
        addExclusion: formValues.addExclusion,
        deleteFiles: true,
        selectedArr: [getState()?.byage?.movies[movies?.data?.[0]?.dataIndex]?.id],
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
        selectedArr.push(getState()?.byage?.movies[e?.dataIndex]?.id)
      }
      if (!settings || !settings.radarrUrl || !settings.radarrApi || !settings.keyOmdb || !settings.v3) {
        return dispatch(setAlert('You must enter the settings', 'error'))
      }
      const body = JSON.stringify({
        radarrUrl: settings.radarrUrl,
        radarrApi: settings.radarrApi,
        keyOmdb: settings.keyOmdb,
        v3: settings.v3,
        addExclusions: formValues.addExclusion,
        deleteFiles: true,
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
