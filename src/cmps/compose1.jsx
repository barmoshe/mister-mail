import path from "../services/image-path";

import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { emailService } from "../services/EmailService";

export function EmailCompose({ onSendEmail }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState(emailService.createEmail());

  function handleChange(ev) {
    let { value, name: field, type } = ev.target;
    // value = type === 'number' ? +value : value
    setEmail((prev) => ({ ...prev, [field]: value }));
  }

  async function sendEmail(ev) {
    ev.preventDefault();
    onSendEmail(email);
    navigate(-1);
  }

  return (
    <section className="email-compose">
      <div className="compose-layout">
        <div className="header-container">
          <header>New Message</header>
          <span className="icon-span" onClick={() => navigate(-1)}>
            <img className={"icon"} src={path.x} alt={"x"} />
          </span>
        </div>
        <form
          className="compose-form"
          action=""
          onSubmit={(ev) => sendEmail(ev)}
        >
          <input
            required
            className="to-inp"
            type="text"
            onChange={handleChange}
            name="to"
            value={email.to}
            placeholder="To"
          />

          <input
            required
            className="subj-inp"
            type="text"
            onChange={handleChange}
            name="subject"
            value={email.subject}
            placeholder="Subject"
          />

          <textarea
            required
            className="body-inp txt-area"
            name="body"
            value={email.body}
            onChange={handleChange}
            id=""
          ></textarea>

          <div className="actions">
            <button className="send-btn">Send</button>
          </div>
        </form>
      </div>
    </section>
  );
}
