import userReducer from './reducers/user-reducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  users: userReducer
});

export default reducers;
