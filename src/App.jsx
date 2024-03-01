import { HomePage } from "./pages/HomePage.jsx";
import { EmailIndex } from "./pages/EmailIndex.jsx";
import { AppHeader } from "./cmps/AppHeader.jsx";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

export function App() {
  return (
    <Router>
      <AppHeader />
      <section className="main-app">
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<h1>about</h1>} />
            <Route path="/EmailIndex" element={<EmailIndex />}>
              <Route
                path="/EmailIndex/:emailId"
                element={<h1>email details</h1>}
              />
            </Route>
          </Routes>
        </main>
      </section>
    </Router>
  );
}
