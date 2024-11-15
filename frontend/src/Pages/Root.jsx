import { Outlet } from 'react-router-dom'
import MainNav from '../Components/MainNav/MainNav'
import MainFooter from '../Components/Footer/MainFooter'

const Root = () => {
  return (
    <>
      <MainNav/>
      <Outlet/>
      <MainFooter/>
    </>
  )
}

export default Root
