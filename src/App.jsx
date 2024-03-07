import { HomePage } from "./pages/HomePage.jsx";
import { EmailIndex } from "./pages/EmailIndex.jsx";
import { EmailDetails } from "./pages/EmailDetails.jsx";
import { AppHeader } from "./cmps/AppHeader.jsx";
import { SideBar } from "./cmps/SideBar.jsx";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
export function App() {
  //gmail fronted clone
  return (
    <Router>
      <section className="main-layout">
        <AppHeader />
        <SideBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<h1>about</h1>} />
            <Route path="/EmailIndex" element={<EmailIndex />} />
            <Route path="/email/:emailId" element={<EmailDetails />} />
          </Routes>
        </main>
      </section>
    </Router>
  );
}
