import React, { useState, useEffect } from "react";
import { useParams, Outlet, useSearchParams } from "react-router-dom";
import { emailService } from "./../services/email.service.js";
import { eventBusService } from "../services/event-bus.service.js";

import { EmailList } from "./../cmps/EmailList.jsx";
import { EmailActions } from "./../cmps/EmailsActions.jsx";
import { Compose } from "./../cmps/Compose.jsx";

function useEmailFilterAndSort() {
  const [filterBy, setFilterBy] = useState({});
  const [sortBy, setSortBy] = useState("sentAt");

  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setFilterBy(
      emailService.getFromParamsAndFolder(searchParams, params.folder)
    );
  }, [params.folder, searchParams]);

  useEffect(() => {
    const newSearchParams = {
      ...searchParams,
      ...cleanFilterAndSort(filterBy, sortBy),
    };
    setSearchParams(newSearchParams);
  }, [filterBy, sortBy]);

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
    }
    return { ...cleanFilter, sortBy };
  }

  return { filterBy, setFilterBy, sortBy, setSortBy };
}

function useComposeMode() {
  const [composeMode, setComposeMode] = useState("");

  useEffect(() => {
    const unsubscribe = eventBusService.on("compose", toggleComposeMode);
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleComposeMode = () => {
    setComposeMode("new");
  };

  const handleCloseCompose = () => {
    setComposeMode("");
  };

  return { composeMode, toggleComposeMode, handleCloseCompose };
}

export function NewEmailIndex() {
  const { filterBy, setFilterBy, sortBy, setSortBy } = useEmailFilterAndSort();
  const { composeMode, toggleComposeMode, handleCloseCompose } =
    useComposeMode();
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    async function loadEmails() {
      const emails = await emailService.query(filterBy, sortBy);
      setEmails(emails);
    }
    loadEmails();
  }, [filterBy, sortBy]);

  async function onRemoveEmail(emailId) {
    try {
      // Remove logic here
    } catch (err) {
      console.log("Error in onRemoveEmail", err);
    }
  }

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

  // Other handlers here...

  return (
    <section className="email-index">
      <div className="email-list-container">
        <EmailActions
          filterBy={filterBy}
          onSetFilter={setFilterBy}
          sortBy={sortBy}
          onSetSort={setSortBy}
        />
        <EmailList
          emails={emails}
          onRemoveEmail={onRemoveEmail}
          onUpdateEmail={onUpdateEmail} // This line is essential
        />
      </div>
      {composeMode && (
        <Compose
          handleSendEmail={handleSendEmail}
          handleSaveEmail={handleSaveEmail}
          onCloseCompose={handleCloseCompose}
        />
      )}
    </section>
  );
}
