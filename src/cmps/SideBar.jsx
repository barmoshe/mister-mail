import React, { useState } from "react";
import {
  FaInbox,
  FaStar,
  FaRegPaperPlane,
  FaRegFileAlt,
  FaTrash,
} from "react-icons/fa";

const folders = [
  { name: "Inbox", icon: <FaInbox /> },
  { name: "Starred", icon: <FaStar /> },
  { name: "Sent", icon: <FaRegPaperPlane /> },
  { name: "Drafts", icon: <FaRegFileAlt /> },
  { name: "Trash", icon: <FaTrash /> },
];
const labels = [{ name: "Label1" }, { name: "Label2" }, { name: "Label3" }];

export function SideBar() {
  const [openedItem, setOpenedItem] = useState(folders[0].name);
  return (
    <section className="app-sidebar">
      <div className="sidebar-actions">
        <button className="compose-btn">Compose</button>
      </div>
      <div className="sidebar-folders">
        {folders.map((folder, index) => {
          return (
            <div
              key={index}
              className={`folder ${openedItem === folder.name ? "open" : ""}`}
            >
              <div className="folder-icon">{folder.icon}</div>
              <div className="folder-name">
                <h3>{folder.name}</h3>
              </div>
            </div>
          );
        })}
      </div>
      {/* <div className="sidebar-labels">
        {labels.map((label, index) => {
          return (
            <div
              key={index}
              className={`label ${openedItem === label.name ? "open" : ""}`}
            >
              <h3>{label.name}</h3>
            </div>
          );
        })}
      </div> */}
    </section>
  );
}
