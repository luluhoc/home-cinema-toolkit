import {
  FIND_MOVIES_BY_AGE, START_BY_AGE, DELETE_MOVIE, DELETE_MOVIES,
} from '../actions/types.actions';

const initialState = {
  isLoading: false,
  movies: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case START_BY_AGE:
      return {
        ...state,
        isLoading: true,
        movies: null,
      };
    case FIND_MOVIES_BY_AGE:
      return {
        ...state,
        isLoading: false,
        movies: payload.movies,
      };
    case DELETE_MOVIE:
      return {
        ...state,
        movies: state.movies.filter((m, index) => index !== payload.dataIndex),
      };
    case DELETE_MOVIES:
      return {
        ...state,
        movies: state.movies.filter((m) => {
          for (let i = 0; i < payload.length; i++) {
            const e = payload[i];
            if (m === undefined || m.id === e) { return false; }
          }
          return true;
        }),
      };
    default:
      return state;
  }
}
