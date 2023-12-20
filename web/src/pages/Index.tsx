import { Outlet } from "react-router-dom"
import Menu from "../components/index/Menu";


const Index = () => {
  return (
    <div style={{background: '#fbfbfd'}}>
      <Menu />
      <Outlet />
    </div>
  )
}

export default Index;