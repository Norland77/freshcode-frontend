import { AuthActionEnum, type AuthActions, type AuthState } from './types'

const initialState: AuthState = {
  user: {
    id: '',
    username: '',
    email: ''
  },
  isLogin: false,
  token: '',
}

export default function authReducer (state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionEnum.SET_USER:
      return { ...state, user: action.payload }
    case AuthActionEnum.SET_LOGIN:
      return { ...state, isLogin: action.payload }
    case AuthActionEnum.SET_TOKEN:
      return { ...state, token: action.payload }
    default:
      return state
  }
}
