import { USER_SET, USER_UNSET, USER_LOGIN_REQUESTING,
USER_LOGIN_SUCCESS, USER_LOGIN_REJECT } from './constants';
import Messages from '../../utils/messages';
import AuthUtils from '../../utils/auth';
import XHR, { setToken } from '../../utils/fetch';


export function setUser(user) {
  return {
    type: USER_SET,
    payload: user,
  }
}

export function unsetUser() {
  return {
    type: USER_UNSET,
  }
}

export function loginRequest(email, password) {
  return (dispatch, /* getState */) => {
    dispatch({type : USER_LOGIN_REQUESTING});
    XHR.post('/auth/login', { email, password })
    .then(
      response => {
        AuthUtils.setLogIn(response.token, response.expires, response.user.id);
        setToken(response.token);
        dispatch({ type: USER_LOGIN_SUCCESS, payload: response })
      },
      error => {
        if (error.status === 400) Messages.error('Неверный email / пароль');
        else if (error.status === 404) Messages.error('Пользователь с таким email не найден');
        else Messages.error(error.response.error || 'Ошибка сервера');
        dispatch({ type: USER_LOGIN_REJECT, error: error })
      }
    )
  }
}

export function fetchSelfUser() {
  return (dispatch, /* getState */) => {
    XHR.get('/auth/getself')
    .then(
      response => {
        dispatch({ type: USER_SET, payload: response.data.user })
      },
      error => {
        Messages.error(error.response.error || 'Ошибка сервера');
      }
    )
  }
}
