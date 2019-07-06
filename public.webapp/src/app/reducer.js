import { SET_HEADER } from './constants';

const initialState = {
  header: {
    title: '',
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_HEADER:
      return {
        header: Object.assign(state, action.header),
      }

    default:
      return state
  }
}

export default reducer
