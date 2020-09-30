import { SET_SETTINGS, GET_SETTINGS, NO_SETTINGS } from '../actions/types.actions';

const initialState = {
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_SETTINGS:
      return {
        ...state,
        ...payload,
      };
    case GET_SETTINGS:
      return {
        ...state,
        ...payload,
      };
    case NO_SETTINGS:
      return null;
    default:
      return state;
  }
}
