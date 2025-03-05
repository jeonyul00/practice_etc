import {applyMiddleware, legacy_createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import userReducer from './reducers';
import watchLogin from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = legacy_createStore(userReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(watchLogin);

export default store;
