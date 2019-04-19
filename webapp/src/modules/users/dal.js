
import XHR from '../../utils/fetch';

export const fetchUsers = (params) => XHR.getList('/users', params);

export function addUser(data) {
  const userData = { ...data };
  if (data.city) {
    userData.city_id = data.city.key
  }
  return new Promise((resolve, reject) => {
    XHR.post('/users', userData).then(res => resolve(res.data));
  });
}

export function updateUser(data) {
  return new Promise((resolve, reject) => {
    if (data.city) {
      data.city_id = data.city.key
    }
    XHR.put(`/users/${data.id}`, data).then((res) => resolve());
  })
}

export function getUser(id) {
  return new Promise((resolve, reject) => {
    XHR.get(`/users/${id}`).then((res) => {
      const { data } = res;
      const userData = { ...data };
      if (data.city) {
        const { id: key, name: label } = data.city;
        userData.city = { key, label }
      }
      resolve(userData);
    });
  });
}

export function updatePassword(data) {
  XHR.post('/users/update/password', data);
}


export function isEmailExist(validationData) {
  return new Promise((resolve, reject) => {
    XHR.post('/users/checkemail', validationData)
      .then(res => resolve(res.data));
  });
}

export function isPhoneExist(validationData) {
  return new Promise((resolve, reject) => {
    XHR.post('/users/checkphone', validationData)
      .then(res => resolve(res.data));

  });
}