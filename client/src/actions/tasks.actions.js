import axios from 'axios';
import setAlert from './alert.actions';
import { GET_TASKS, SET_TASK, SWITCH_TASK } from './types.actions';

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
    if (err && err.response && err.response.data && err.response.data.errors) {
      const { errors } = err?.response?.data;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
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
    if (err && err.response && err.response.data && err.response.data.errors) {
      const { errors } = err?.response?.data;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
    }
  }
};

export const switchTask = (formValues) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(formValues);
  try {
    const res = await axios.patch('/api/tasks/switch', body, config);
    dispatch({
      type: SWITCH_TASK,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    if (err && err.response && err.response.data && err.response.data.errors) {
      const { errors } = err?.response?.data;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
    }
  }
};