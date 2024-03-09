import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { emailService } from "../services/email.service";

export function EmailDetails() {
  const [email, setEmail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmail();
    emailService.markAsRead(params.emailId);
  }, [params.emailId]);

  async function loadEmail() {
    try {
      const email = await emailService.getById(params.emailId);
      setEmail(email);
    } catch (err) {
      navigate("/emails");
      console.log("Error in loadEmail", err);
    }
  }

  if (!email) return <div>Loading..</div>;

  return (
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
        <Link to="/emails">Go back</Link>
      </div>
    </section>
  );
}