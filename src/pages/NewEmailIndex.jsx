import React, { useState, useEffect } from "react";
import {
  useParams,
  Outlet,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { emailService } from "./../services/email.service.js";
import {
  eventBusService,
  showSuccessMsg,
  showErrorMsg,
  showUserMsg,
} from "../services/event-bus.service.js";

import { EmailList } from "./../cmps/EmailList.jsx";
import { EmailActions } from "./../cmps/EmailsActions.jsx";
import { Compose } from "./../cmps/Compose.jsx";
import { ProgressBar } from "./../cmps/ProgressBar.jsx";
import { Context } from "../App.jsx";

export function NewEmailIndex() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [emails, setEmails] = useState([]);
  const [filterBy, setFilterBy] = useState(
    emailService.getFromParamsAndFolder(searchParams, params.folder)
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "sentAt");
  const [composeMode, setComposeMode] = useState(searchParams.get("compose"));
  const [unreadInbox, setUnreadInbox] = React.useContext(Context);

  async function loadEmails() {
    try {
      const emails = await emailService.query(filterBy, sortBy);
      setEmails(emails);
      onSetUnreadInbox(emails);
    } catch (error) {
      showErrorMsg("Failed to load emails");
      console.error("Error loading emails:", error);
    }
  }

  // Effect for updating filterBy when params.folder changes
  useEffect(() => {
    setFilterBy({ ...filterBy, folder: params.folder });
  }, [params.folder]);

  // Effect for updating searchParams and loading emails when filterBy or sortBy changes
  useEffect(() => {
    const newSearchParams = composeMode
      ? {
          compose: composeMode,
          ...searchParams,
          ...cleanFilterAndSort(filterBy, sortBy),
        }
      : { ...searchParams, ...cleanFilterAndSort(filterBy, sortBy) };
    if (composeMode === "false" || composeMode === "")
      delete newSearchParams.compose;
    if (filterBy.sentAt === null || filterBy.sentAt === "")
      delete newSearchParams.sentAt;

    setSearchParams(newSearchParams);
    loadEmails();
    console.table(filterBy);
  }, [filterBy, sortBy]);

  // Effect for toggling composeMode and updating searchParams
  useEffect(() => {
    const newSearchParams = searchParams;
    if (composeMode === "false" || composeMode === "")
      newSearchParams.delete("compose");
    else newSearchParams.set("compose", composeMode);
    setSearchParams(newSearchParams);
    const unsubscribe = eventBusService.on("compose", toggleComposeMode);
    return () => {
      unsubscribe();
    };
  }, [composeMode]);

  function cleanFilterAndSort(filterBy, sortBy) {
    const cleanFilter = { ...filterBy };
    // delete cleanFilter.folder;
    for (const key in cleanFilter) {
      if (
        cleanFilter[key] === "" ||
        cleanFilter[key] === null ||
        cleanFilter[key] === "all"
      )
        delete cleanFilter[key];
    }
    return { ...cleanFilter, sortBy };
  }

  // Handler for removing email
  async function onRemoveEmail(emailId) {
    try {
      let email = emails.find((email) => email.id === emailId);
      if (email.removedAt) {
        await emailService.remove(emailId);
      } else {
        email.removedAt = Date.now();
        await emailService.save(email);
      }
      setEmails((prevEmails) =>
        prevEmails.filter((currEmail) => currEmail.id !== emailId)
      );
      showSuccessMsg("Email removed successfully");
    } catch (err) {
      showErrorMsg("Failed to remove email");
      console.error("Error removing email:", err);
    }
  }

  // Handler for updating email
  async function onUpdateEmail(email) {
    try {
      const savedEmail = await emailService.save(email);
      setEmails((prevEmails) =>
        prevEmails.map((currEmail) =>
          currEmail.id === email.id ? email : currEmail
        )
      );
      showSuccessMsg("Email updated successfully");
      return savedEmail;
    } catch (err) {
      showErrorMsg("Failed to update email");
      console.error("Error updating email:", err);
    }
  }

  // Handler for sending email
  async function handleSendEmail(email) {
    email.sentAt = Date.now();
    email.isDraft = false;
    console.log("email sent : ", email);
    try {
      const addedEmail = await onUpdateEmail(email);
      if (filterBy.folder === "sent") setEmails([addedEmail]);
      if (filterBy.folder === "drafts")
        setEmails((prevEmails) =>
          prevEmails.filter((currEmail) => currEmail.id !== email.id)
        );
      showSuccessMsg("Email sent successfully");
      return addedEmail;
    } catch (err) {
      showErrorMsg("Failed to send email");
      console.error("Error sending email:", err);
    }
    setComposeMode("false");
  }

  // Handler for saving email
  async function handleSaveEmail(savedDraft) {
    savedDraft.sentAt = Date.now();
    if (savedDraft.id === "new" || !savedDraft.id) {
      try {
        const newDraft = await emailService.createDraft(savedDraft);
        if (filterBy.folder === "drafts")
          setEmails((prevEmails) => [...prevEmails, newDraft]);
        setComposeMode(newDraft.id);
        showSuccessMsg("Email draft saved successfully");
        return newDraft;
      } catch (err) {
        showErrorMsg("Failed to save email draft");
        console.error("Error saving email draft:", err);
      }
    } else {
      try {
        const addedEmail = await emailService.save(savedDraft);
        if (filterBy.folder === "drafts")
          setEmails((prevEmails) =>
            prevEmails.map((currEmail) =>
              currEmail.id === savedDraft.id ? addedEmail : currEmail
            )
          );
        setComposeMode(addedEmail.id);
        showSuccessMsg("Email draft updated successfully");
        return addedEmail;
      } catch (err) {
        showErrorMsg("Failed to update email draft");
        console.error("Error updating email draft:", err);
      }
    }
  }

  async function onSetUnreadInbox(emails) {
    try {
      const unreadInbox = await emailService.countUnreadEmails();
      setUnreadInbox(unreadInbox);
    } catch (error) {
      showErrorMsg("Failed to set unread inbox");
      console.error("Error setting unread inbox:", error);
    }
  }

  function onEditEmail(emailId) {
    setComposeMode(emailId);
  }

  // Handler for setting filter
  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }

  // Handler for setting sort
  function onSetSort(sortBy) {
    setSortBy(sortBy);
    loadEmails();
  }

  // Handler for toggling compose mode
  const toggleComposeMode = () => {
    setComposeMode("new");
  };

  // Handler for closing compose mode
  const handleCloseCompose = () => {
    setComposeMode("false");
  };

  // Conditional rendering for Outlet or Email Index section
  if (params.emailId)
    return (
      <>
        <Outlet />
        {composeMode !== "false" && composeMode !== "" && composeMode && (
          <Compose
            handleSendEmail={handleSendEmail}
            handleSaveEmail={handleSaveEmail}
            onCloseCompose={handleCloseCompose}
          />
        )}
      </>
    );
  return (
    <section className="email-index">
      <div className="email-list-container">
        <EmailActions
          filterBy={filterBy}
          onSetFilter={onSetFilter}
          sortBy={sortBy}
          onSetSort={onSetSort}
        />
        <EmailList
          emails={emails}
          onRemoveEmail={onRemoveEmail}
          onUpdateEmail={onUpdateEmail}
          onEditEmail={onEditEmail}
        />
      </div>
      {composeMode !== "false" && composeMode !== "" && composeMode && (
        <Compose
          handleSendEmail={handleSendEmail}
          handleSaveEmail={handleSaveEmail}
          onCloseCompose={handleCloseCompose}
        />
      )}
      <ProgressBar
        value={emails.filter((email) => !email.isRead).length}
        max={emails.length}
      />
    </section>
  );
}
