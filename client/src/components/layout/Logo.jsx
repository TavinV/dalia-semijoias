import { NavLink } from "react-router-dom"

const Logo = () => {
  return (
    <NavLink to="/">
      <img className="h-12" src="/logo.png" alt="Logo" />
    </NavLink>
  )
}

export default Logo
