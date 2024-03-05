import { useEffect, useState } from "react";
import { emailService } from "./../services/email.service.js";
import { EmailList } from "./../cmps/EmailList.jsx";
import { EmailFilter } from "./../cmps/EmailFilter.jsx";
import { SideBar } from "./../cmps/SideBar.jsx";

// const loggedinUser = {
//   email: "user@appsus.com",
//   fullname: "Mahatma Appsus",
// };

export function EmailIndex() {
  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
  console.log(filterBy);

  useEffect(() => {
    loadEmails();
  }, [filterBy]);

  async function loadEmails() {
    try {
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
      await emailService.remove(emailId);
      setEmails((prevEmails) => {
        return prevEmails.filter((email) => email.id !== emailId);
      });
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
  return (
    <section className="email-index">
      <SideBar />
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
