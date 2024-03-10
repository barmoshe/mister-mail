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
      navigate("/emails/inbox");
      console.log("Error in loadEmail", err);
    }
  }
  async function handleBack() {
    navigate(-1);
  }

  if (!email) return <div>Loading..</div>;

  return (
    <section className="email-details">
      <div className="email-details-toolbar"></div>
      <div className="email-details-content">
        <div className="email-details-header">
          <h2>{email.subject}</h2>
          <div className="email-details-meta">
            <p>Sent At: {new Date(email.sentAt).toLocaleString()}</p>
            <p>From: {email.from}</p>
          </div>
        </div>
        <div className="email-details-body">
          <p>{email.body}</p>
        </div>
      </div>
      <div className="email-details-footer">
        <button onClick={handleBack}>Back</button>
      </div>
    </section>
  );
}
