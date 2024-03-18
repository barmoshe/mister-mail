import React, { useEffect, useState } from "react";
import { emailService } from "./../services/email.service.js";
import { useSearchParams } from "react-router-dom";

export function useCompose() {
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

  return {
    email,
    viewState,
    handleInputChange,
    onSendEmail,
    handleClose,
    handleMinimize,
    handleMaximize,
    handleRestore,
  };
}
