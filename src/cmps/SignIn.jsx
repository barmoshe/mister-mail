import { NavLink } from "react-router-dom";

export function SignIn() {
  return (
    <section className="sign-in-container">
      <img
        className="google-logo"
        src="assets/img/google-logo.png"
        alt="google-logo"
      />
      <h1> welcome</h1>
      <nav>
        <NavLink to="/EmailIndex">Sign in </NavLink>
      </nav>
    </section>
  );
}
