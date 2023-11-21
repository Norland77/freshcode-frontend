import { type ILoginResponse } from 'interfaces/Auth'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

interface loaderType {
  token: string
  user: ILoginResponse
}
export const refreshTokensLoader = async (): Promise<loaderType> => {
  let token: string = ''
  let user: ILoginResponse = {
    id: '',
    username: '',
    email: ''
  }
  await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/refresh-tokens`, {
    withCredentials: true
  }).then((res: { data: { accessToken: string } }) => {
    token = res.data.accessToken
    const loginRes: ILoginResponse = jwtDecode(token)
    user = {
      id: loginRes.id,
      username: loginRes.username,
      email: loginRes.email
    }
  }).catch(err => {
    console.log(err)
  })
  return { token, user }
}
