import styles from './registration.module.scss'
import {useNavigate} from "react-router-dom";
import {IRegister} from "interfaces/Auth.ts";
import {useState} from "react";
import axios from "axios";
import {Container, Row} from "react-bootstrap";
const Registration = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<IRegister>({
    email: '',
    password: '',
    nickname: '',
    passwordRepeat: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const [isValidPasswordLength, setIsValidPasswordLength] = useState(true)
  const [isValidLoginAndEmail, setIsValidLoginAndEmail] = useState(true)
  const [isValidEmail, setIsValidEmail] = useState(true)

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
  const register = async (): Promise<void> => {
    event?.preventDefault()
    if (formData.password.length < 8) {
      setIsValidPasswordLength(false)
      return
    }
    if (formData.password !== formData.passwordRepeat) {
      setIsValidPassword(false)
      return
    }
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, {
      username: formData.nickname,
      email: formData.email,
      password: formData.password,
      passwordRepeat: formData.passwordRepeat,
    }, { withCredentials: true }).then(res => {
      if (res.statusText === 'Created') {
        alert('Ви успішно зареєструвались, тепер можете увійти використавши email та пароль')
        navigate('/login')
      }
    }).catch(err => {
      if (err.response.data.message === 'This username or email is already in use') {
        setIsValidLoginAndEmail(false)
      }
      if (err.response.data.message[0] === 'email must be an email') {
        setIsValidEmail(false)
      }
    })
  }

  return (
    <div className={styles.bg}>
      <Container className={styles.register}>
        <h2>Registration</h2>
        <form>
          <Row sm={1} className={styles.validate_block}>
            <input required={true} className={isValidLoginAndEmail ? styles.correct_input : styles.wrong_input} type="text" placeholder={'Нікнейм'} name={'nickname'} value={formData.nickname} onChange={handleChange}/>
            <span className={isValidLoginAndEmail ? styles.valid_text : styles.wrong_text}>Такий нікнейм або email вже зайняті</span>
          </Row>
          <Row className={styles.validate_block}>
            <input required={true} className={isValidLoginAndEmail ? styles.correct_input : styles.wrong_input} type="email" placeholder={'Email'} name={'email'} value={formData.email} onChange={handleChange}/>
            <span className={isValidLoginAndEmail ? styles.valid_text : styles.wrong_text}>Такий нікнейм або email вже зайняті</span>
            <span className={isValidEmail ? styles.valid_text : styles.wrong_text}>Це не валідний email</span>
          </Row>
          <Row className={styles.validate_block}>
            <div className={styles.password_block}>
              <input required={true} className={isValidPasswordLength ? styles.correct_input : styles.wrong_input} type={showPassword ? 'text' : 'password' } placeholder={'Password'} name={'password'} value={formData.password} onChange={handleChange}/>
              <button className={styles.showBtn} onClick={handleClick} children={showPassword ? 'HIDE' : 'SHOW'}/>
            </div>
            <span className={isValidPasswordLength ? styles.valid_text : styles.wrong_text}>Пароль повинен мати більше 8 символів</span>
          </Row>
          <Row className={styles.validate_block}>
            <div className={styles.password_block}>
              <input required={true} className={isValidPassword ? styles.correct_input : styles.wrong_input} type={showPassword ? 'text' : 'password' } placeholder={'Password'} name={'passwordRepeat'} value={formData.passwordRepeat} onChange={handleChange}/>
              <button className={styles.showBtn} onClick={handleClick} children={showPassword ? 'HIDE' : 'SHOW'}/>
            </div>
            <span className={isValidPassword ? styles.valid_text : styles.wrong_text}>Паролі не співпадають</span>
          </Row>
          <input onClick={register} type={'submit'} value={'Зареєструватись'}/>
        </form>
      </Container>
    </div>
  );
};

export default Registration;