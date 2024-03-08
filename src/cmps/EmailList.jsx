import { EmailPreview } from "./EmailPreview.jsx";
import { FaRegStar as Star } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export function EmailList({ emails, onRemoveEmail, updateEmail }) {
  const location = useLocation();
  function className(email) {
    return email.isRead
      ? "email-preview-container"
      : "email-preview-container unread";
  }
  function onStarClick(email) {
    email.isStarred = !email.isStarred;
    updateEmail(email);
  }
  function starClassName(isStarred) {
    return isStarred ? "star on" : "star off";
  }
  return (
    <div className="email-table-grid">
      {emails.map((email) => (
        <article key={email.id} className={className(email)}>
          <div className="email-actions">
            <button
              className="remove-email"
              onClick={() => onRemoveEmail(email.id)}
            >
              X
            </button>
            <input className="select-email" type="checkbox" />
            <button
              className={starClassName(email.isStarred)}
              onClick={() => {
                onStarClick(email);
              }}
            >
              <Star />
            </button>
          </div>
          <Link to={`${location.pathname}/${email.id}`}>
            <EmailPreview email={email} />
          </Link>
        </article>
      ))}
    </div>
  );
}
