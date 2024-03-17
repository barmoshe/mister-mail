import React, { useEffect, useState } from "react";
import { emailService } from "./../services/email.service.js";
import { useSearchParams } from "react-router-dom";
import { FaExpand, FaMinimize, FaCompress } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export function Compose({ handleSendEmail, onCloseCompose, handleSaveEmail }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewState, setViewState] = useState("normal");
  const [email, setEmail] = useState(emailService.getEmptyEmailDraft());

  useEffect(() => {
    if (searchParams.get("compose") && searchParams.get("compose") !== "new") {
      loadEmail();
    }
  }, []);

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
    if (viewState !== "normal") {
      setViewState("normal");
    } else {
      setViewState("fullscreen");
    }
  };

  const handleRestore = () => {
    setViewState("normal");
  };

  return (
    <div className={`compose ${viewState}`}>
      <div className="compose-header">
        <div className="compose-header-actions">
          <button onClick={handleMinimize}>
            {viewState !== "minimized" && <FaMinimize />}
          </button>

          <button onClick={handleMaximize}>
            {viewState === "fullscreen" ? <FaCompress /> : <FaExpand />}
          </button>
          <button onClick={handleClose}>
            {" "}
            <IoClose />
          </button>
        </div>
      </div>
      <div className="compose-body">
        {viewState !== "minimized" && (
          <form className={`compose-form ${viewState}`} onSubmit={onSendEmail}>
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
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}
