import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { SideBar } from "../cmps/SideBar";
import { Link } from "react-router-dom";

import { emailService } from "../services/email.service";
{
  /* <Route
path="/EmailIndex/:emailId"
element={<h1>email details</h1>}
/> */
}
export function EmailDetails() {
  const [email, setEmail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmail();
  }, [params.emailId]);

  async function loadEmail() {
    try {
      const email = await emailService.getById(params.emailId);
      setEmail(email);
    } catch (err) {
      navigate("/EmailIndex");
      console.log("Error in loadEmail", err);
    }
  }

  console.log("params", params);
  if (!email) return <div>Loading..</div>;
  return (
    <section className="email-index">
      <SideBar />

      <section className="email-details">
        <div className="email-details-toolbar">
          <h3>Tool bar</h3>
        </div>
        <div className="email-details-header">
          <h2>{email.subject}</h2>
          <h3>{email.sentAt}</h3>
          <h3>{email.from}</h3>
        </div>
        <div className="email-details-body">
          <h3>{email.body}</h3>
          <Link to="/EmailIndex">Go back</Link>
        </div>
      </section>
    </section>
  );
}
