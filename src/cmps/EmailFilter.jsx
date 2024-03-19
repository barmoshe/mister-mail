import React, { useEffect, useState } from "react";
import { eventBusService } from "../services/event-bus.service";

export function EmailFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    const unsubscribe = eventBusService.on("filter-by-text", (text) => {
      setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, txt: text }));
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
      folder: filterBy.folder,
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
      <input
        type="date"
        id="startDay"
        name="startDay"
        value={filterByToEdit.startDay ? filterByToEdit.startDay : ""}
        onChange={(ev) => handleChange(ev)}
      />
      <input
        type="date"
        id="endDay"
        name="endDay"
        value={filterByToEdit.endDay ? filterByToEdit.endDay : ""}
        onChange={(ev) => handleChange(ev)}
      />
    </div>
  );
}
