export function EmailPreview({ email }) {
  return (
    <article className="email-preview">
      <span className="from">{email.from}</span>
      <span className="subject">{email.subject}</span>
      <span className="body-prefix">{email.body.substring(0, 50)}</span>
      <span className="date">
        {new Date(email.sentAt).toLocaleDateString()}
      </span>
    </article>
  );
}
