import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Layout from './pages/Layout/Layout'
import { refreshTokensLoader } from './loaders/refreshTokens'
import Login from './pages/Login/Login.tsx'
import Registration from "./pages/Registration/Registration.tsx";

const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<Layout/>} loader={refreshTokensLoader}>
        <Route path="/login" element={<Login />}/>
        <Route path="/registration" element={<Registration />}/>
      </Route>
))

export default router
