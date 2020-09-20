import axios from 'axios';
import setAlert from './alert.actions';
import { FIND_MOVIES, START_MOVIES_SEARCH, DELETE_MOVIE, DELETE_MOVIES } from './types.actions';

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

export const deleteMovie = (movies, formValues) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    console.log(movies);
    if (movies?.data?.length === 1) {
      console.log('1')
      console.log(movies.data)
      console.log(getState()?.rating?.movies[movies?.data?.[0]?.dataIndex])
      const deleteData = {
        ...formValues,
        selectedArr: [getState()?.rating?.movies[movies?.data?.[0]?.dataIndex]?.rId],
      }
      const body = JSON.stringify(deleteData);
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
      console.log(selectedArr)
      const deleteData = {
        ...formValues,
        selectedArr,
      }
      const body = JSON.stringify(deleteData);
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
