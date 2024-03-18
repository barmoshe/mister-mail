import { Link, useLocation } from "react-router-dom";

import { EmailPreview } from "./EmailPreview.jsx";

import { FaRegStar as Star, FaPencil as Edit } from "react-icons/fa6";

export function EmailList({
  emails,
  onRemoveEmail,
  onUpdateEmail,
  onEditEmail,
}) {
  const location = useLocation();
  function className(email) {
    return email.isRead
      ? "email-preview-container"
      : "email-preview-container unread";
  }
  function onStarClick(email) {
    email.isStarred = !email.isStarred;
    onUpdateEmail(email);
    console.log("starred email", email);
  }
  function starClassName(isStarred) {
    return isStarred ? "star on" : "star off";
  }
  function changeReadStatus(email) {
    email.isRead = !email.isRead;
    onUpdateEmail(email);
  }

  return emails?.length === 0 || !emails ? (
    <div className="empty-emails">No emails to show</div>
  ) : (
    <div className="email-table-grid">
      {emails.map((email) => (
        <article key={email.id} className={className(email)}>
          <div className="email-actions ">
            <button
              className={starClassName(email.isStarred)}
              onClick={() => {
                onStarClick(email);
              }}
            >
              <Star />
            </button>

            <button
              className="edit-email"
              onClick={() => onEditEmail(email.id)}
            >
              <Edit />
            </button>
          </div>
          <Link to={`${location.pathname}/${email.id}`}>
            <EmailPreview email={email} />
          </Link>
          <button
            className="remove-email "
            onClick={() => {
              onRemoveEmail(email.id);
            }}
          >
            X
          </button>
        </article>
      ))}
    </div>
  );
}
