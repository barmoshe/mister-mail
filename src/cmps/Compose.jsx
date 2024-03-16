import React, { useEffect, useState } from "react";
import { emailService } from "./../services/email.service.js";

import { useSearchParams } from "react-router-dom";
//same as robotEdit
export function Compose({ handleSendEmail, onCloseCompose, handleSaveEmail }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewState, setViewState] = useState("normal"); // State to track view state
  const [email, setEmail] = useState(emailService.getEmptyEmailDraft());

  useEffect(() => {
    if (searchParams.get("compose"))
      if (searchParams.get("compose") !== "new") loadEmail();
  }, []);

  useEffect(() => {
    console.log("email  changed", { ...email });
  }, [email]);
  async function loadEmail() {
    try {
      const email = await emailService.getById(searchParams.get("compose"));
      if (email.isDraft) {
        setEmail(email);
      } else {
        setEmail(emailService.getEmptyEmailDraft());
      }
    } catch (err) {
      console.log("email not found", err);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmail((prevEmail) => ({
      ...prevEmail,
      [name]: value,
    }));
    onSaveEmail({ ...email, [name]: value });
  };

  const onSendEmail = (e) => {
    e.preventDefault();
    handleSendEmail(email);
    setEmail(emailService.getEmptyEmailDraft());
  };

  async function onSaveEmail(email) {
    const emailSaved = await handleSaveEmail(email);
    if (email.id === "new") {
      setEmail({ ...email, id: emailSaved.id });
    }
  }

  const handleClose = () => {
    onCloseCompose();
  };

  const handleMinimize = () => {
    setViewState("minimized");
  };

  const handleMaximize = () => {
    setViewState("fullscreen");
  };

  const handleRestore = () => {
    setViewState("normal");
  };

  return (
    <div className={`compose ${viewState}`}>
      {viewState === "minimized" && (
        <button type="button" onClick={handleRestore}>
          Restore
        </button>
      )}

      {viewState !== "minimized" && (
        <form onSubmit={onSendEmail}>
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            name="to"
            value={email.to}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={email.subject}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            name="body"
            value={email.body}
            onChange={handleInputChange}
            required
          ></textarea>
          <div className="compose-actions">
            <button type="submit">Send</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
            {viewState === "normal" && (
              <button type="button" onClick={handleMinimize}>
                Minimize
              </button>
            )}
            {viewState === "normal" && (
              <button type="button" onClick={handleMaximize}>
                Fullscreen
              </button>
            )}
            {viewState !== "normal" && (
              <button type="button" onClick={handleRestore}>
                Restore
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
