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
import { ProgressBar } from "./../cmps/ProgressBar.jsx";

function calcUnreadEmails({ emails }) {
  return emails.reduce((acc, email) => {
    return email.isRead ? acc : acc + 1;
  }, 0);
}

export function EmailIndex() {
  const params = useParams();
  const navigate = useNavigate();

  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState(
    emailService.getDefaultFilter(params.folder)
  );
  const [sortBy, setSortBy] = useState("sentAt");
  console.log(emails);
  const [unreadEmails, setUnreadEmails] = useState(0);

  useEffect(() => {
    if (params.folder) {
      setFilterBy(emailService.getDefaultFilter(params.folder));
    } else navigate("/emails/inbox");
  }, [params.folder]);

  useEffect(() => {
    loadEmails();
    setUnreadEmails(calcUnreadEmails({ emails }));
  }, [filterBy, sortBy]);

  async function loadEmails() {
    try {
      console.log("filterBy", filterBy);
      const emails = await emailService.query(filterBy, sortBy);
      setEmails(emails);
    } catch (err) {
      console.log("Error in loadEmails", err);
    }
  }

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }
  function onSetSort(sortBy) {
    console.log("sortBy from ei", sortBy);
    setSortBy(sortBy);
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
        <EmailFilter
          filterBy={filterBy}
          onSetFilter={onSetFilter}
          sortBy={sortBy}
          onSetSort={onSetSort}
        />
        <EmailList
          emails={emails}
          onRemoveEmail={onRemoveEmail}
          updateEmail={onUpdateEmail}
        />
      </div>
      <ProgressBar value={unreadEmails} max={emails.length} />
    </section>
  );
}
