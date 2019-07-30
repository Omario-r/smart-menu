import XHR from '../../utils/fetch';

export const fetchAllMenus = (params) => XHR.getList('/menus', params);

export const fetchUserMenus = (params) => XHR.getList('/user-menus', params);

export const addMenu = (params) => XHR.post('/menus', params);

export const  updateMenu = (id, params) => XHR.put(`/menus/${id}`, params);

export const getMenu = (id) => XHR.get(`/menus/${id}`);

export const cloneMenu = (id) => XHR.get(`/menus-clone/${id}`);
