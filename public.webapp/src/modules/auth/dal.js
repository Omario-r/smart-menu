import XHR from '../../utils/fetch';


export const userRegister = data  => XHR.post('/users/register', data)
