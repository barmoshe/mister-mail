import { useEffect, useState } from "react";
import { emailService } from "./../services/email.service.js";
import { EmailList } from "./../cmps/EmailList.jsx";
import { EmailFilter } from "./../cmps/EmailFilter.jsx";

const loggedinUser = {
  email: "user@appsus.com",
  fullname: "Mahatma Appsus",
};

export function EmailIndex() {
  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());

  useEffect(() => {
    loadEmails();
  }, []);

  async function loadEmails() {
    try {
      const emails = await emailService.query();
      setEmails(emails);
    } catch (err) {
      console.log("Error in loadEmails", err);
    }
  }

  async function onRemoveEmail(emailId) {
    try {
      await emailService.remove(emailId);
      setEmails((prevEmails) => {
        return prevEmails.filter((email) => email.id !== emailId);
      });
    } catch (err) {
      console.log("Error in onRemoveEmail", err);
    }
  }

  console.log("emails", emails);
  if (!emails) return <div>Loading..</div>; //todo: add loader
  return (
    <section className="email-index">
      <div className="email-sidebar">
        <button>Compose</button>
        <button>Inbox</button>
        <button>Starred</button>
        <button>Sent</button>
        <button>Drafts</button>
        <button>Trash</button>
      </div>
      <div className="email-list-container">
        <EmailFilter filterBy={filterBy} onSetFilter={setFilterBy} />
        <EmailList emails={emails} onRemoveEmail={onRemoveEmail} />
      </div>
    </section>
  );
}
