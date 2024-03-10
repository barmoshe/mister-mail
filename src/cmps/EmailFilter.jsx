import React, { useEffect, useState } from "react";
import { eventBusService } from "../services/event-bus.service";

export function EmailFilter({ filterBy, onSetFilter, sortBy, onSetSort }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
  const [sortByToEdit, setSortByToEdit] = useState(sortBy);

  useEffect(() => {
    const unsubscribe = eventBusService.on("filter-by-text", (text) => {
      setFilterByToEdit({ ...filterByToEdit, text });
    });
    return () => {
      unsubscribe();
    };
  }, [filterByToEdit]);

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  useEffect(() => {
    console.log("sortByToEdit", sortByToEdit);
    onSetSort(sortByToEdit);
  }, [sortByToEdit]);

  function handleChange(ev) {
    let { value, name: field, type } = ev.target;
    value = type === "number" ? +value : value;
    setFilterByToEdit({ ...filterByToEdit, [field]: value });
  }
  function handleSortChange(ev) {
    console.log("ev.target", ev.target);
    let { value } = ev.target;
    console.log("value", value);
    setSortByToEdit((prevSortBy) => value);
  }

  return (
    <div className="emails-actions">
      <form className="email-filter">
        <select
          name="isRead"
          value={filterByToEdit.isRead}
          onChange={handleChange}
        >
          <option value="all">All</option>
          <option value="true">Read</option>
          <option value="false">Unread</option>
        </select>
      </form>
      <form className="email-sort">
        <select name="sortBy" value={sortBy} onChange={handleSortChange}>
          <option value="sentAt">Date</option>
          <option value="subject">Subject</option>
        </select>
      </form>
    </div>
  );
}
