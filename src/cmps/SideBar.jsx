import { useState, useEffect, useContext } from "react";
import { eventBusService, openCompose } from "./../services/event-bus.service";

import {
  FaInbox,
  FaStar,
  FaRegPaperPlane,
  FaRegFileAlt,
  FaTrash,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

import { Context } from "../App";

export function SideBar() {
  const [unreadInbox, setUnreadInbox] = useContext(Context);
  const [openedItem, setOpenedItem] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const location = useLocation();
  let searchParams = new URLSearchParams(location.search);
  const currentPath = location.pathname; // Get current path
  const [folders, setFolders] = useState([
    { name: "Inbox", path: "/emails/inbox", icon: <FaInbox /> },
    { name: "Starred", path: "/emails/starred", icon: <FaStar /> },
    { name: "Sent", path: "/emails/sent", icon: <FaRegPaperPlane /> },
    { name: "Drafts", path: "/emails/drafts", icon: <FaRegFileAlt /> },
    { name: "Trash", path: "/emails/trash", icon: <FaTrash /> },
  ]);

  useEffect(() => {
    const unsubscribe = eventBusService.on("toggle-sidebar", () => {
      setIsSideBarOpen(!isSideBarOpen);
    });
    return () => {
      unsubscribe();
    };
  }, [isSideBarOpen]);

  useEffect(() => {
    // Find the matching folder based on path
    const matchingFolder = folders.find((folder) =>
      currentPath.startsWith(folder.path)
    );
    if (matchingFolder) {
      setOpenedItem(matchingFolder.name);
    }
  }, [currentPath]);
  useEffect(() => {
    searchParams = new URLSearchParams(location.search);
    updatefoldersPaths();
  }, [openedItem]);

  function updatefoldersPaths() {
    setFolders(
      folders.map((folder) => {
        //if folder.path has a search query remove it and add the new one
        if (searchParams.toString()) {
          folder.path =
            folder.path.split("?")[0] + "?" + searchParams.toString();
        } else {
          folder.path = folder.path.split("?")[0];
        }
        return folder;
      })
    );
  }
  function handleFolderClick(folderName) {
    setOpenedItem(folderName);
  }

  function handleComposeClick() {
    openCompose();
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
                      {folder.name === "Inbox" && <p>unread: {unreadInbox}</p>}
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
