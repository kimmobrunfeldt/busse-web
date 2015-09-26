import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import apiMiddleware from '../middleware/api';
import createLoggerMiddleware from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLoggerMiddleware({
    level: 'info'
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  apiMiddleware,
  loggerMiddleware
)(createStore);

function configureStore(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState);
    return store;
}

export default configureStore;
