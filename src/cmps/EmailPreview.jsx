// const email = {
//     id: 'e101',
//     subject: 'Miss you!'
//     ,
//     body: 'Would love to catch up sometimes'
//     ,
//     isRead: false,
//     isStarred: false,
//     sentAt : 1551133930594,
//     removedAt : null, //for later use
//     from: 'momo@momo.com',
//     to: 'user@appsus.com'
//     }
export function EmailPreview({ email }) {
  return (
    <article className="email-preview">
      <h6>FROM: {email.from}</h6>
      <h6>TO: {email.to}</h6>
      <h2>{email.subject}</h2>
      <h4>{email.body}</h4>
    </article>
  );
}
