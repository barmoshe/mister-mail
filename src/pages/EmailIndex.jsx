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
import { Compose } from "./../cmps/Compose.jsx";

export function EmailIndex() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [emails, setEmails] = useState(null);
  const [filterBy, setFilterBy] = useState({
    ...emailService.getDefaultFilter(params.folder),
    isRead: searchParams.get("isRead") ? searchParams.get("isRead") : "all",
    text: searchParams.get("text") ? searchParams.get("text") : "",
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "sentAt");

  useEffect(() => {
    if (!params.folder) {
      navigate("/emails/inbox");
    }
    setFilterBy({
      ...emailService.getDefaultFilter(params.folder),
      isRead: filterBy.isRead ? filterBy.isRead : "all",
      text: filterBy.text ? filterBy.text : "",
    });
  }, [params.folder, searchParams.get("isRead"), searchParams.get("text")]);

  useEffect(() => {
    const sortBy = searchParams.get("sortBy") || "sentAt";
    onSetSort(sortBy);
  }, [searchParams.get("sortBy")]);

  useEffect(() => {
    setSearchParams({ ...searchParams, sortBy });
  }, [sortBy]);

  useEffect(() => {
    loadEmails();
    setSearchParams({
      ...searchParams,
      isRead: filterBy.isRead ? filterBy.isRead : "all",
      text: filterBy.text ? filterBy.text : "",
    });
  }, [filterBy]);

  async function loadEmails() {
    try {
      const emails = await emailService.query(filterBy, sortBy);
      console.log("filterBy", filterBy);
      console.log("emails", emails);
      setEmails(emails);
    } catch (err) {
      console.log("Error in loadEmails", err);
    }
  }

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }
  function onSetSort(sortBy) {
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
      {searchParams.get("compose") && <Compose />}
    </section>
  );
}
