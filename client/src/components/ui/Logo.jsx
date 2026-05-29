import { NavLink } from "react-router-dom"

const Logo = () => {
  return (
    <NavLink to="/">
      <img
        className="h-8 sm:h-12 w-auto"
        src="/logo.png"
        alt="Dália Semijoias"
      />
    </NavLink>
  );
};

export default Logo;
