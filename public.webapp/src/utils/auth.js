
const isLoggedIn = () => {
  if (localStorage.getItem('access_token') &&
    localStorage.getItem('user_id') &&
    localStorage.getItem('expires') &&
    parseInt(localStorage.getItem('expires'),10) > Date.now()
  )
  return {
    token: localStorage.getItem('access_token'),
    user_id: parseInt(localStorage.getItem('user_id'), 10)
  };
  else return false;
}

const setLogIn = (token, expires, user_id) => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user_id', user_id);
  localStorage.setItem('expires', expires);
}

const clear = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('expires');
}

export default {
  isLoggedIn, setLogIn, clear
}
