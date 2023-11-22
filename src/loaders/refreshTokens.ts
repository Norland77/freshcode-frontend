import { type ILoginResponse } from 'interfaces/Auth'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
interface loaderType {
  token: string
  user: ILoginResponse
  errStatus: number
}
export const refreshTokensLoader = async (): Promise<loaderType> => {
  let token: string = ''
  let user: ILoginResponse = {
    id: '',
    username: '',
    email: ''
  }
  let errStatus = 0
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
    console.log(err.response.status === 401)
    if (err.response.status === 401) {
      errStatus = err.response.status
    }
  })
  return { token, user, errStatus }
}
