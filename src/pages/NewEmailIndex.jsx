import { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";

import { emailService } from "./../services/email.service.js";

import { EmailList } from "./../cmps/EmailList.jsx";
import { EmailActions } from "./../cmps/EmailsActions.jsx";

export function NewEmailIndex() {
  const params = useParams();

  const [emails, setEmails] = useState([]);
  const [filterBy, setFilterBy] = useState(
    emailService.getDefaultFilter(params.folder)
  );
  const [sortBy, setSortBy] = useState("sentAt");
  async function loadEmails() {
    const emails = await emailService.query(filterBy, sortBy);
    setEmails(emails);
  }
  useEffect(() => {
    setFilterBy({ ...filterBy, folder: params.folder });
  }, [params.folder]);

  useEffect(() => {
    loadEmails();
  }, [filterBy, sortBy]);

  async function onRemoveEmail(emailId) {
    try {
      //if email is in trash, remove it permanently else set isTrash to true
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
  async function onUpdateEmail(email) {
    try {
      await emailService.save(email);
      setEmails((prevEmails) => {
        return prevEmails.map((currEmail) =>
          currEmail.id === email.id ? email : currEmail
        );
      });
    } catch (err) {
      console.log("Error in onUpdateEmail", err);
    }
  }
  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }
  function onSetSort(sortBy) {
    setSortBy(sortBy);
  }

  if (params.emailId) return <Outlet />;
  return (
    <section className="email-index">
      <div className="email-list-container">
        <EmailActions
          filterBy={filterBy}
          onSetFilter={onSetFilter}
          sortBy={filterBy.sortBy}
          onSetSort={onSetSort}
        />
        <EmailList
          emails={emails}
          onRemoveEmail={onRemoveEmail}
          onUpdateEmail={onUpdateEmail}
        />
      </div>
    </section>
  );
}
