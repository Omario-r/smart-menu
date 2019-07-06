import { ADDING_RECIPE_SET_MENU, ADDING_RECIPE_SET_SELECTED_RECIPE, ADDING_RECIPE_UNSET_MENU } from "./constants";

const initialState = {
  menu: null,
  recipe: null,
  errors: [],
}

export default (state = initialState, action) => {
  let menu;
  let recipe;

  switch (action.type) {

    case ADDING_RECIPE_SET_MENU:
      menu = action.payload;
      return {
        menu,
      }

    case ADDING_RECIPE_SET_SELECTED_RECIPE:
      recipe = action.payload;
      return {
        ...state,
        recipe,
      }
    
    case ADDING_RECIPE_UNSET_MENU:
      return {
        menu: null,
        recipe: null,
      }
    
    default:
    return state
  }
}