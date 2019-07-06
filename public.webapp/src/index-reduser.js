import { combineReducers } from 'redux';

import auth from './modules/auth/reducer';
import app from './app/reducer';
import addingRecipe from './modules/my-food-menu/reducer'


const IndexReducer = combineReducers({
  auth,
  app,
  addingRecipe,
});

export default IndexReducer;
