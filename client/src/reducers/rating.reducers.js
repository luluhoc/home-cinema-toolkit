import {
  FIND_MOVIES, START_MOVIES_SEARCH, DELETE_MOVIE, DELETE_MOVIES, GOT_MOVIES_FROM_RADARR, CLEAR_DB, ERROR_GETTING_MOVIES,
} from '../actions/types.actions';

const initialState = {
  isLoading: false,
  message: null,
  movies: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case START_MOVIES_SEARCH:
      return {
        ...state,
        isLoading: true,
        message: 'Getting movies from radarr',
        movies: [],
      };
    case GOT_MOVIES_FROM_RADARR:
      return {
        ...state,
        isLoading: true,
        message: 'Getting IMDB RATING for:',
      };
    case FIND_MOVIES:
      return {
        ...state,
        isLoading: false,
        movies: payload.returnedMovies,
      };
    case CLEAR_DB:
      return {
        ...state,
        movies: [],
      };
    case ERROR_GETTING_MOVIES:
      return {
        ...state,
        isLoading: false,
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
            if (m === undefined || m.rId === e) { return false; }
          }
          return true;
        }),
      };
    default:
      return state;
  }
}
