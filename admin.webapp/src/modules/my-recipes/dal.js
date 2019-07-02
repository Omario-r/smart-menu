import XHR from '../../utils/fetch';

export const fetchRecipes = (params) => XHR.getList('/recipes', params);

export const addRecipe = (params) => XHR.post('/recipes', params);

export const  updateRecipe = (id, params) => XHR.put(`/recipes/${id}`, params);

export const getRecipe = (id) => XHR.get(`/recipes/${id}`);
