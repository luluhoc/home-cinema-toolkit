import axios from 'axios';
import setAlert from './alert.actions';
import { GET_TASKS, SET_TASK } from './types.actions';

export const setTask = (formValues) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(formValues);
  try {
    const res = await axios.post('/api/tasks', body, config);
    dispatch({
      type: SET_TASK,
      payload: res.data,
    });
    dispatch(setAlert('Task Saved', 'success'))
  } catch (err) {
    console.log(err);
    const { errors } = err?.response?.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const getTasks = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/tasks');
    dispatch({
      type: GET_TASKS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    const { errors } = err?.response?.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};