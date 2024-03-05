import React from "react";

export function SideBar() {
  return (
    <div className="email-sidebar">
      <button>Compose</button>
      <ul>
        <li>Inbox</li>
        <li>Starred</li>
        <li>Sent</li>
        <li>Drafts</li>
      </ul>
    </div>
  );
}
