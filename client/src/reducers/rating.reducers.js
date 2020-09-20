import update from 'immutability-helper';
import { FIND_MOVIES, START_MOVIES_SEARCH, DELETE_MOVIE } from '../actions/types.actions';

const initialState = {
  isLoading: true,
  movies: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case START_MOVIES_SEARCH:
      return {
        ...state,
        isLoading: true,
        movies: [],
      };
    case FIND_MOVIES:
      return {
        ...state,
        isLoading: false,
        movies: payload.returnedMovies,
      };
    case DELETE_MOVIE:
      return {
        ...state,
        movies: state.movies.filter((m, index) => index !== payload.dataIndex),
      };
    default:
      return state;
  }
}
