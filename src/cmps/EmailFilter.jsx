import React, { useEffect, useState } from "react";
import { eventBusService } from "../services/event-bus.service";

export function EmailFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

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

  function handleChange(ev) {
    let { value, name: field, type } = ev.target;
    value = type === "number" ? +value : value;
    setFilterByToEdit({ ...filterByToEdit, [field]: value });
  }

  //filter form attributes :  subject&body- text input , read/unread- select input,star /unstar- select input
  return (
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
  );
}