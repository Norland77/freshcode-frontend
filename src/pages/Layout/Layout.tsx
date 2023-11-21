import { Outlet, useLoaderData } from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './layout.module.scss'
import { type FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { type ILoginResponse } from 'interfaces/Auth'
const Layout: FC = () => {
  const dispatch = useDispatch()
  const { token, user } = useLoaderData() as { token: string, user: ILoginResponse }
  useEffect(() => {
    if (token !== '') {
      dispatch({ type: 'SET_TOKEN', payload: token })
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_LOGIN', payload: true })
    }
  }, [])

  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
