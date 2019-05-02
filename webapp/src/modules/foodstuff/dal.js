import XHR from '../../utils/fetch';

export const fetchFoodstuff = (params) => XHR.getList('/foodstuff', params);

export const addFoodstuff = (params) => XHR.post('/foodstuff', params);

export const  updateFoodstuff = (id, params) => XHR.put(`/foodstuff/${id}`, params);

export const getFoodstuff = (id) => XHR.get(`/foodstuff/${id}`);

export const fetchFoodstuffForSelect = (category) => {
  return new Promise((resolve, reject) => {
    XHR.get(`/foodstuff/category/${category}`)
    .then(
      resp => resolve(
        resp.data.map(fs => ({
          value: fs.id,
          text: fs.name
        }))
      ),
      reject
    );
  });
}
