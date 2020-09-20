import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { SET_ALERT, REMOVE_ALERT } from './types.actions';

const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
  toast[alertType](msg);

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
export default setAlert;
