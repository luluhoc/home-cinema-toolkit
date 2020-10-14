import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from './reducers/index.reducers';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['settings', 'rating', 'byage', 'alert', 'form', 'tasks'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(persistedReducer,
    composeWithDevTools(applyMiddleware(thunk)));
  const persistor = persistStore(store);
  persistor.pause();
  return { store, persistor };
};
