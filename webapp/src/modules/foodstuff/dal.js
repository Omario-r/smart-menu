import XHR from '../../utils/fetch';

export const fetchFoodstuff = (params) => XHR.getList('/foodstuff', params);

export const addFoodstuff = (params) => XHR.post('/foodstuff', params);

export const  updateFoodstuff = (id, params) => XHR.put(`/foodstuff/${id}`, params);

export const getFoodstuff = (id) => XHR.get(`/foodstuff/${id}`);
