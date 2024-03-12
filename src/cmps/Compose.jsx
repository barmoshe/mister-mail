// Compose.jsx
import React, { useState } from "react";
import { emailService } from "./../services/email.service.js";

export function Compose({ onClose }) {
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmail((prevEmail) => ({ ...prevEmail, [name]: value }));
  };

  const handleSend = async () => {
    try {
      // Add any additional logic or validation here
      await emailService.send(newEmail);
      onClose(); // Close the compose window after sending the email
    } catch (err) {
      console.log("Error sending email:", err);
    }
  };

  return (
    <div className="compose-overlay">
      <div className="compose-modal">
        <h2>Compose New Email</h2>
        <label>
          To:
          <input
            type="text"
            name="to"
            value={newEmail.to}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={newEmail.subject}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Body:
          <textarea
            name="body"
            value={newEmail.body}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleSend}>Send</button>
        <button className="cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
