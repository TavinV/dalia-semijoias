import { NavLink } from "react-router-dom"

const Logo = ( {height = 12}) => {
  return (
    <NavLink to="/">
      <img className={`h-${height}`} src="/logo.png" alt="Logo" />
    </NavLink>
  )
}

export default Logo
