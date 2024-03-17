import React, { useEffect, useState } from "react";
import { emailService } from "./../services/email.service.js";
import { useSearchParams } from "react-router-dom";

// Component
export function Compose({ handleSendEmail, onCloseCompose, handleSaveEmail }) {
  // State initialization
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewState, setViewState] = useState("normal");
  const [email, setEmail] = useState(emailService.getEmptyEmailDraft());

  // Effects
  useEffect(() => {
    if (searchParams.get("compose") && searchParams.get("compose") !== "new") {
      loadEmail();
    }
  }, []);

  // Functions
  async function loadEmail() {
    try {
      const loadedEmail = await emailService.getById(
        searchParams.get("compose")
      );
      setEmail(
        loadedEmail.isDraft ? loadedEmail : emailService.getEmptyEmailDraft()
      );
    } catch (err) {
      console.log("Error loading email:", err);
      onCloseCompose();
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmail((prevEmail) => ({ ...prevEmail, [name]: value }));
    onSaveEmail({ ...email, [name]: value });
  };

  const onSendEmail = (e) => {
    e.preventDefault();
    handleSendEmail(email);
    setEmail(emailService.getEmptyEmailDraft());
  };

  async function onSaveEmail(email) {
    const savedEmail = await handleSaveEmail(email);
    if (email.id === "new") {
      setEmail({ ...email, id: savedEmail.id });
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

  // Rendering
  return (
    <div className={`compose ${viewState}`}>
      {viewState === "minimized" && (
        <button type="button" onClick={handleRestore}>
          Restore
        </button>
      )}

      {viewState !== "minimized" && (
        <form onSubmit={onSendEmail} className="gmail-compose">
          <div className="gmail-compose-header">
            <input
              type="email"
              id="to"
              name="to"
              value={email.to}
              onChange={handleInputChange}
              placeholder="To"
              required
            />
            <input
              type="text"
              id="subject"
              name="subject"
              value={email.subject}
              onChange={handleInputChange}
              placeholder="Subject"
              required
            />
          </div>
          <textarea
            id="body"
            name="body"
            value={email.body}
            onChange={handleInputChange}
            placeholder="Compose email..."
            required
          ></textarea>
          <div className="gmail-compose-footer">
            <button type="submit" className="gmail-send-button">
              Send
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="gmail-close-button"
            >
              Discard
            </button>
          </div>
          {viewState === "normal" && (
            <div className="gmail-compose-controls">
              <button
                type="button"
                onClick={handleMinimize}
                className="gmail-minimize-button"
              >
                Minimize
              </button>
              <button
                type="button"
                onClick={handleMaximize}
                className="gmail-maximize-button"
              >
                Fullscreen
              </button>
            </div>
          )}
          {viewState !== "normal" && (
            <button
              type="button"
              onClick={handleRestore}
              className="gmail-restore-button"
            >
              Restore
            </button>
          )}
        </form>
      )}
    </div>
  );
}
