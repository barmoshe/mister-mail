import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { createContext, useState } from "react";

import { HomePage } from "./pages/HomePage.jsx";
// import { EmailIndex } from "./pages/EmailIndex.jsx";
import { EmailDetails } from "./pages/EmailDetails.jsx";
import { NewEmailIndex } from "./pages/NewEmailIndex.jsx";
import { UserMsg } from "./cmps/UserMsg.jsx";

import { AppHeader } from "./cmps/AppHeader.jsx";
import { SideBar } from "./cmps/SideBar.jsx";

export const Context = createContext();
export function App() {
  const [unreadInbox, setUnreadInbox] = useState(0);
  //gmail fronted clone
  return (
    <Context.Provider value={[unreadInbox, setUnreadInbox]}>
      <Router>
        <section className="main-layout">
          <AppHeader />
          <SideBar />
          <UserMsg />
          <main className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<h1>about</h1>} />
              <Route
                path="/emails"
                element={<Navigate to="/emails/inbox" replace />}
              />
              {/* <Route path="/emails/:folder" element={<EmailIndex />}> */}
              <Route path="/emails/:folder" element={<NewEmailIndex />}>
                <Route
                  path="/emails/:folder/:emailId"
                  element={<EmailDetails />}
                />
              </Route>
            </Routes>
          </main>
        </section>
      </Router>
    </Context.Provider>
  );
}
