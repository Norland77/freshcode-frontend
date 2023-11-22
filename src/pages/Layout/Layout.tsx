import {Navigate, Outlet, useLoaderData} from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './layout.module.scss'
import { type FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { type ILoginResponse } from 'interfaces/Auth'
const Layout: FC = () => {
  const dispatch = useDispatch()
  const { token, user, errStatus } = useLoaderData() as { token: string, user: ILoginResponse, errStatus: number }

  useEffect(() => {
    if (token !== '') {
      dispatch({ type: 'SET_TOKEN', payload: token })
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_LOGIN', payload: true })
    }
  }, [])
  const currentPath = window.location.pathname;

  if (errStatus === 401 && currentPath !== '/login' && currentPath !== '/registration') {
    return <Navigate to={"/login"} />
  }

  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
