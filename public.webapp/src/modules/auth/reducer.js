import { USER_SET, USER_UNSET,
  USER_LOGIN_REQUESTING, USER_LOGIN_SUCCESS, USER_LOGIN_REJECT } from './constants';
// import { ROLES } from '../../../../static/constants';

const initialState = {
  user: null,
  loginRequesting: false,
  errors: [],
}

const reducer = (state = initialState, action) => {
  let user;
  switch (action.type) {

    case USER_SET:
      user = action.payload;
      // user.isAdmin = user.role === ROLES.admin;
      return {
        user,
      }

    case USER_UNSET:
      return {
        user: null,
      }

    case USER_LOGIN_REQUESTING:
      return {
        loginRequesting: true,
        errors: [],
      }

    case USER_LOGIN_SUCCESS:
      user = action.payload.user;
      // user.isAdmin = user.role === ROLES.admin;
      return {
        user,
        loginRequesting: false,
        errors: [],
      }

    case USER_LOGIN_REJECT:
      return {
        loginRequesting: false,
        errors: [action.error.response],
      }

    default:
      return state
  }
}

export default reducer
