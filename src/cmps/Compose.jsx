// Compose.jsx
import React, { useState } from "react";
import { emailService } from "./../services/email.service.js";

export function Compose({ onSendEmail }) {
  const [email, setEmail] = useState(emailService.createEmail());
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  function handleChange(ev) {
    let { value, name: field } = ev.target;
    setEmail((prev) => ({ ...prev, [field]: value }));
  }

  async function sendEmail(ev) {
    ev.preventDefault();
    await onSendEmail(email);
  }
  return (
    <section className="compose">
      <form className="compose-form" onSubmit={sendEmail}>
        <input
          type="text"
          name="to"
          value={email.to}
          placeholder="To"
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          value={email.subject}
          placeholder="Subject"
          onChange={handleChange}
        />
        <textarea
          name="body"
          value={email.body}
          placeholder="Compose your email"
          onChange={handleChange}
        ></textarea>
        <button>Send</button>
      </form>
    </section>
  );
}
