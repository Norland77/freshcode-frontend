import './App.css';
import { RouterProvider } from 'react-router-dom'
import BigLoaderSpinner from "./components/Big-loader-spinner/Big-loader-spinner";
import router from "./router";

function App() {
  return (
    <RouterProvider router={router} fallbackElement={<BigLoaderSpinner />}/>
  );
}

export default App;
