import React, { useEffect, useState } from "react";
import { eventBusService } from "../services/event-bus.service";

export function EmailFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    const unsubscribe = eventBusService.on("filter-by-text", (text) => {
      setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, text }));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange(ev) {
    const { value, name: field, type } = ev.target;
    const newValue = type === "number" ? +value : value;
    setFilterByToEdit((prevFilterBy) => ({
      ...prevFilterBy,
      [field]: newValue,
    }));
  }

  return (
    <div className="email-filter">
      <span>Filter:</span>
      <select
        name="isRead"
        value={filterByToEdit.isRead ? filterByToEdit.isRead : "all"}
        onChange={(ev) => handleChange(ev)}
      >
        <option value="all">All</option>
        <option value="true">Read</option>
        <option value="false">Unread</option>
      </select>
    </div>
  );
}
