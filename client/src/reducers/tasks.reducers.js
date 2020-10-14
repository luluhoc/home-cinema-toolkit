import { GET_TASKS, SET_TASK, SWITCH_TASK } from '../actions/types.actions';

const initialState = {
  tasks: [],
  isLoading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TASKS:
      return {
        ...state,
        tasks: payload,
        isLoading: false,
      };
    case SET_TASK:
      return {
        ...state,
        tasks: payload,
        isLoading: false,
      };
    case SWITCH_TASK:
      return {
        ...state,
        tasks: payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
