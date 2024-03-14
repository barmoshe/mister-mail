import { NavLink } from "react-router-dom";

import { toggleSidebar, filterByText } from "../services/event-bus.service";

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

export function AppHeader() {
  function handleMenuClick() {
    toggleSidebar();
  }
  function handleSearch(ev) {
    filterByText(ev.target.value);
  }
  return (
    <header className="app-header">
      <div className="menu-logo-container">
        <img
          src={menuSvg}
          alt="menu"
          className="header-icon"
          onClick={() => handleMenuClick()}
        />
        <NavLink to="/emails/inbox">
          <img src={logo} alt="logo" className="header-logo" />
        </NavLink>
      </div>
      <div className="search-bar">
        <input type="text" name="text" onChange={handleSearch} />
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
