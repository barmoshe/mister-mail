import { useEffect, useState } from "react";
import {
  Outlet,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { emailService } from "./../services/email.service.js";

import { EmailList } from "./../cmps/EmailList.jsx";
import { EmailFilter } from "./../cmps/EmailFilter.jsx";

export function EmailIndex() {
  const params = useParams();

  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(
    emailService.getDefaultFilter(params.folder)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (params.folder) {
      setFilterBy(emailService.getDefaultFilter(params.folder));
    } else navigate("/emails/inbox");
  }, [params.folder]);

  useEffect(() => {
    loadEmails();
  }, [filterBy]);

  async function loadEmails() {
    try {
      console.log("filterBy", filterBy);
      const emails = await emailService.query(filterBy);
      setEmails(emails);
    } catch (err) {
      console.log("Error in loadEmails", err);
    }
  }

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }
  async function onRemoveEmail(emailId) {
    try {
      //if email is in trash, remove it permanently else set isTrash to true
      let email = emails.find((email) => email.id === emailId);
      if (email.isTrash) {
        await emailService.remove(emailId);
      } else {
        email.isTrash = true;
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

  if (!emails) return <div>Loading..</div>; //todo: add loader
  return params.emailId ? (
    <Outlet />
  ) : (
    <section className="email-index">
      <div className="email-list-container">
        <EmailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
        <EmailList
          emails={emails}
          onRemoveEmail={onRemoveEmail}
          updateEmail={onUpdateEmail}
        />
      </div>
    </section>
  );
}
