import { type ILoginResponse } from 'interfaces/Auth.ts'

export interface AuthState {
  user: ILoginResponse
  isLogin: boolean
  currentToken: string
}

export enum AuthActionEnum {
  SET_USER = 'SET_USER',
  SET_LOGIN = 'SET_LOGIN',
  SET_TOKEN = 'SET_TOKEN',
}
export interface SetUserAction {
  type: AuthActionEnum.SET_USER
  payload: ILoginResponse
}

export interface SetLoginAction {
  type: AuthActionEnum.SET_LOGIN
  payload: boolean
}

export interface SetTokenAction {
  type: AuthActionEnum.SET_TOKEN
  payload: string
}

export type AuthActions = SetUserAction | SetLoginAction | SetTokenAction
