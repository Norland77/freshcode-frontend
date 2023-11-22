import {Link, useNavigate} from "react-router-dom";
import logo from 'img/boardLogo.svg'
import {useTypedSelector} from "hooks/useTypedSelector.ts";
import styles from './header.module.scss'
import {Col, Container, Image} from "react-bootstrap";
import {useDispatch} from "react-redux";
import axios from "axios";
const Header = () => {
  const { user, isLogin } = useTypedSelector(state => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logout = async (): Promise<void> => {
    await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
      withCredentials: true
    }).then(res => {
      if (res.data === 'OK') {
        dispatch({ type: 'SET_LOGIN', payload: false })
        dispatch({ type: 'SET_ADMIN', payload: false })
        navigate('/')
      }
    })
  }
  return (
    <div className={styles.header}>
      <Container className={styles.container}>
          <Col sm={1} md={3} xl={2}>
            <Link className={styles.logo} to={'/board'}>
              <Image rounded={true} src={logo} alt="logo"/>
              <span>Board</span>
            </Link>
          </Col>
        <Col sm={1} md={3} xl={2}>
          { isLogin ?
            <div className={styles.user}>
              <span>{user.username}</span>
              <span onClick={logout} className={styles.logout}>Logout</span>
            </div> :
            <div className={styles.auth}>
              <Link to={'/login'}>login</Link>
              <Link to={'/registration'}>registration</Link>
            </div>
          }
        </Col>
      </Container>
    </div>
  );
};

export default Header;