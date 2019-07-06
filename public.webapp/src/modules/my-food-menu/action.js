import { ADDING_RECIPE_SET_MENU, ADDING_RECIPE_UNSET_MENU, ADDING_RECIPE_SET_SELECTED_RECIPE } from "./constants";

export function setMenuForRecipeAdding(menu) {
  return {
    type: ADDING_RECIPE_SET_MENU,
    payload: menu,
  }
}

export function unsetMenuForRecipeAdding() {
  return {
    type: ADDING_RECIPE_UNSET_MENU,
  }
}

export function setRecipeForRecipeAdiing(recipe) {
  return {
    type: ADDING_RECIPE_SET_SELECTED_RECIPE,
    payload: recipe,
  }
}