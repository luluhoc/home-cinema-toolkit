import {
  START_ALL_MOVIES_SEARCH, GET_ALL_MOVIES, WHITELIST,
} from '../actions/types.actions';

const initialState = {
  isLoading: false,
  message: null,
  movies: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case START_ALL_MOVIES_SEARCH:
      return {
        ...state,
        isLoading: true,
        message: 'Fetching movies and ratings',
        movies: [],
      };
    case GET_ALL_MOVIES:
      return {
        ...state,
        isLoading: false,
        movies: payload.returnedMovies,
      };
    case WHITELIST:
      return {
        ...state,
        isLoading: false,
        movies: state.movies.filter((m) => m.rId !== payload.movie.rId).concat(payload.movie),
      };
    default:
      return state;
  }
}
