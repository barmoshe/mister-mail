import { NavLink } from "react-router-dom";
import logoSrc from "../assets/imgs/MisterMail-logo.png";

export function SignIn() {
  return (
    <section className="sign-in-container">
      <img className="google-logo" src={logoSrc} alt="google-logo" />
      <h1> welcome</h1>
      <nav>
        <NavLink to="/EmailIndex">Sign in </NavLink>
      </nav>
    </section>
  );
}
