import styles from './login.module.scss'
import {Navigate, useNavigate} from "react-router-dom";
import {ILogin, ILoginResponse} from "interfaces/Auth.ts";
import {useState} from "react";
import axios from "axios";
import {Container, Row} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "hooks/useTypedSelector.ts";
const Login = () => {
  const navigate = useNavigate()
  const { isLogin } = useTypedSelector(state => state.auth)
  const [formData, setFormData] = useState<ILogin>({
    email: '',
    password: '',
  })
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)

  const handleClick = (): void => {
    event?.preventDefault()
    setShowPassword(!showPassword)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = event.target
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }
  const login = async (): Promise<void> => {
    event?.preventDefault()
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, {
      email: formData.email,
      password: formData.password,
    }, { withCredentials: true }).then(res => {
      const token = res.data.accessToken
      const loginRes: ILoginResponse = jwtDecode(token)
      const user: ILoginResponse = {
        id: loginRes.id,
        username: loginRes.username,
        email: loginRes.email
      }
      dispatch({ type: 'SET_TOKEN', payload: token })
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_LOGIN', payload: true })
      navigate('/')
    })
  }

  return (
    <>
    { isLogin ? (<Navigate to={'/'} />) :
        <div className={styles.bg}>
          <Container className={styles.register}>
            <h2>Login</h2>
            <form>
              <Row sm={1} className={styles.validate_block}>
                <input required={true} className={styles.correct_input} type="email" placeholder={'email'} name={'email'} value={formData.email} onChange={handleChange}/>
              </Row>
              <Row className={styles.validate_block}>
                <div className={styles.password_block}>
                  <input required={true} className={styles.correct_input} type={showPassword ? 'text' : 'password' } placeholder={'Password'} name={'password'} value={formData.password} onChange={handleChange}/>
                  <button className={styles.showBtn} onClick={handleClick} children={showPassword ? 'HIDE' : 'SHOW'}/>
                </div>
              </Row>
              <input onClick={login} type={'submit'} value={'Увійти'}/>
            </form>
          </Container>
        </div>
    }
    </>
  );
};

export default Login;