import './App.css'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from './Pages/Root';
import Home from './Pages/Home/Home';

function App() {

  const router=createBrowserRouter([{
    path:"/",
    element:<Root/>,
    // errorElement:<MainError />,
    children:[
      {index:true,element:<Home/>},
    ]
  }])


  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
