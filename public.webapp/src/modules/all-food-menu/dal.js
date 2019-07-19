import XHR from '../../utils/fetch';

export const fetchMenus = (params) => XHR.getList('/menus', params);

export const addMenu = (params) => XHR.post('/menus', params);

export const  updateMenu = (id, params) => XHR.put(`/menus/${id}`, params);

export const getMenu = (id) => XHR.get(`/menus/${id}`);