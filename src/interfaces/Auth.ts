export interface ILogin {
  email: string
  password: string
}

export interface ILoginResponse {
  id: string
  username: string
  email: string
}

export interface IRegister {
  email: string
  password: string
  nickname: string
  passwordRepeat: string
}
