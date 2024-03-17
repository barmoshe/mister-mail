import React, { useState, useEffect } from "react";
import { useParams, Outlet, useSearchParams } from "react-router-dom";
import { emailService } from "./../services/email.service.js";
import { utilService } from "./../services/util.service.js";
import { eventBusService } from "../services/event-bus.service.js";

import { EmailList } from "./../cmps/EmailList.jsx";
import { EmailActions } from "./../cmps/EmailsActions.jsx";
import { Compose } from "./../cmps/Compose.jsx";

export function NewEmailIndex() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [emails, setEmails] = useState([]);
  const [filterBy, setFilterBy] = useState(
    emailService.getFromParamsAndFolder(searchParams, params.folder)
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "sentAt");
  const [composeMode, setComposeMode] = useState(searchParams.get("compose"));

  async function loadEmails() {
    const emails = await emailService.query(filterBy, sortBy);
    setEmails(emails);
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

    setSearchParams(newSearchParams);
    loadEmails();
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
    delete cleanFilter.folder;
    for (const key in cleanFilter) {
      if (
        cleanFilter[key] === "" ||
        cleanFilter[key] === null ||
        cleanFilter[key] === "all"
      )
        delete cleanFilter[key];
      return { ...cleanFilter, sortBy };
    }
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
    } catch (err) {
      console.log("Error in onRemoveEmail", err);
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
      return savedEmail;
    } catch (err) {
      console.log("Error in onUpdateEmail", err);
    }
  }

  // Handler for sending email
  async function handleSendEmail(email) {
    email.sentAt = Date.now();
    email.isDraft = false;
    console.log("email sent : ", email);
    try {
      const addedEmail = await onUpdateEmail(email);
      if (filterBy.folder === "sent") setEmails((prevEmails) => [addedEmail]);
      if (filterBy.folder === "drafts")
        setEmails((prevEmails) =>
          prevEmails.filter((currEmail) => currEmail.id !== email.id)
        );
      return addedEmail;
    } catch (err) {
      console.log("Error in onAddEmail", err);
    }
    setComposeMode("false");
  }

  // Handler for saving email
  async function handleSaveEmail(savedDraft) {
    savedDraft.sentAt = Date.now();
    if (savedDraft.id === "new" || !savedDraft.id) {
      const newDraft = await emailService.createDraft(savedDraft);
      if (filterBy.folder === "drafts")
        setEmails((prevEmails) => [...prevEmails, newDraft]);
      setComposeMode(newDraft.id);
      return newDraft;
    }
    console.log("savedDraft", savedDraft.id);
    try {
      const addedEmail = await emailService.save(savedDraft);
      if (filterBy.folder === "drafts")
        setEmails((prevEmails) =>
          prevEmails.map((currEmail) =>
            currEmail.id === savedDraft.id ? addedEmail : currEmail
          )
        );

      setComposeMode(addedEmail.id);
      return addedEmail;
    } catch (err) {
      console.log("Error in onAddEmail", err);
    }
  }

  // Handler for setting filter
  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }

  // Handler for setting sort
  function onSetSort(sortBy) {
    setSortBy(sortBy);
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
        />
      </div>
      {composeMode !== "false" && composeMode !== "" && composeMode && (
        <Compose
          handleSendEmail={handleSendEmail}
          handleSaveEmail={handleSaveEmail}
          onCloseCompose={handleCloseCompose}
        />
      )}
    </section>
  );
}
