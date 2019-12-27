import XHR from '../../utils/fetch';


export const userRegister = data  => XHR.post('/users/register', data);

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
