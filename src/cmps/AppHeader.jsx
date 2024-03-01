import { NavLink } from "react-router-dom";
import logo from "../assets/imgs/MisterMail-logo.png";
import menuSvg from "../assets/imgs/menu.svg";
import support from "../assets/imgs/question_mark.svg";
import settings from "../assets/imgs/settings.svg";
import apps from "../assets/imgs/apps.svg";
import user from "../assets/imgs/user.svg";

const icons = [
  { src: support, alt: "help" },
  { src: settings, alt: "settings" },
  { src: apps, alt: "apps" },
  { src: user, alt: "user" },
];

export function AppHeader(HandleMenuClick) {
  return (
    <header className="app-header">
      <div className="header-left-side">
        <img
          src={menuSvg}
          alt="menu"
          className="header-icon"
          onClick={HandleMenuClick}
        />
        <NavLink to="/EmailIndex">
          <img src={logo} alt="logo" className="header-logo" />
        </NavLink>
      </div>
      <div className="header-right-side">
        {icons.map((icon, index) => {
          return (
            <img
              src={icon.src}
              alt={icon.alt}
              key={index}
              className="header-icon"
            />
          );
        })}
      </div>
    </header>
  );
}
