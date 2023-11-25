import './App.css';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import BigLoaderSpinner from "./components/Big-loader-spinner/Big-loader-spinner";
import Layout from "./pages/Layout/Layout.tsx";
import {refreshTokensLoader} from "./loaders/refreshTokens.ts";
import Login from "./pages/Login/Login.tsx";
import Registration from "./pages/Registration/Registration.tsx";
import BoardsPage from "./pages/BoardsPage/BoardsPage.tsx";
import {boardsLoader} from "./loaders/boardsLoader.ts";
import {useTypedSelector} from "hooks/useTypedSelector.ts";
import BoardPage from "./pages/BoardPage/BoardPage.tsx";
import {listsLoader} from "./loaders/listsLoader.ts";
function App() {
  const { currentToken } = useTypedSelector(state => state.auth)

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout/>} loader={refreshTokensLoader}>
      <Route path="/login" element={<Login />}/>
      <Route path="/registration" element={<Registration />}/>
      <Route path="/board" element={<BoardsPage />} loader={() => boardsLoader(currentToken)}/>
      <Route path="/board/:id" element={<BoardPage />}  loader={({ params }) => listsLoader(params.id, currentToken)}/>
    </Route>
  ))

  return (
    <RouterProvider router={router} fallbackElement={<BigLoaderSpinner />}/>
  );
}

export default App;
