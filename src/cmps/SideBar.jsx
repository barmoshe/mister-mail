import { useState, useEffect } from "react";
import { eventBusService } from "./../services/event-bus.service";

import {
  FaInbox,
  FaStar,
  FaRegPaperPlane,
  FaRegFileAlt,
  FaTrash,
} from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";

const folders = [
  { name: "Inbox", path: "/emails/inbox", icon: <FaInbox /> },
  { name: "Starred", path: "/emails/starred", icon: <FaStar /> },
  { name: "Sent", path: "/emails/sent", icon: <FaRegPaperPlane /> },
  { name: "Drafts", path: "/emails/drafts", icon: <FaRegFileAlt /> },
  { name: "Trash", path: "/emails/trash", icon: <FaTrash /> },
];
const labels = [{ name: "Label1" }, { name: "Label2" }, { name: "Label3" }];

export function SideBar() {
  const [openedItem, setOpenedItem] = useState(folders[0].name);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const params = useParams();
  useEffect(() => {
    const unsubscribe = eventBusService.on("toggle-sidebar", () => {
      setIsSideBarOpen(!isSideBarOpen);
    });
    return () => {
      unsubscribe();
    };
  }, [isSideBarOpen]);

  useEffect(() => {
    if (!params.folder) {
      setOpenedItem(folders[0].name);
    }
  }, [params.folder]);

  function handleFolderClick(folderName) {
    setOpenedItem(folderName);
  }
  function handleComposeClick() {
    //openCompose();
  }

  switch (isSideBarOpen) {
    case true:
      return (
        <section className="app-sidebar">
          <div className="sidebar-actions">
            <button className="compose-btn" onClick={handleComposeClick}>
              Compose
            </button>
          </div>
          <div className="sidebar-folders">
            {folders.map((folder, index) => {
              return (
                <NavLink to={folder.path} key={index}>
                  <div
                    key={index}
                    className={`folder ${
                      openedItem === folder.name ? "open" : ""
                    }`}
                    onClick={() => handleFolderClick(folder.name)}
                  >
                    <div className="folder-icon">{folder.icon}</div>
                    <div className="folder-name">
                      <h3>{folder.name}</h3>
                    </div>
                  </div>
                </NavLink>
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
    case false:
      return (
        <section className="app-sidebar closed">
          <div className="sidebar-actions">
            <button className="compose-btn" onClick={handleComposeClick}>
              C
            </button>
          </div>
          <div className="sidebar-folders">
            {folders.map((folder, index) => {
              return (
                <NavLink to={folder.path} key={index}>
                  <div
                    key={index}
                    className={`folder ${
                      openedItem === folder.name ? "open" : ""
                    }`}
                    onClick={() => handleFolderClick(folder.name)}
                  >
                    <div className="folder-icon">{folder.icon}</div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </section>
      );
  }
}
