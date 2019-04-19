import { combineReducers } from 'redux';

import auth from './modules/auth/reducer';
import app from './app/reducer';


const IndexReducer = combineReducers({
  auth,
  app,
});

export default IndexReducer;
