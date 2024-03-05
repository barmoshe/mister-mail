import React, { useEffect, useState } from "react";

// <EmailFilter> - allow the user to filter the emails by  subject&body , read/unread,star/unstar

export function EmailFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
  console.log(filterByToEdit, "1filterByToEdit");
  console.log(filterBy, "1filterBy");

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
      <input
        type="text"
        name="text"
        value={filterByToEdit.text}
        onChange={handleChange}
      />
      <select
        name="isRead"
        value={filterByToEdit.isRead}
        onChange={handleChange}
      >
        <option value="all">All</option>
        <option value="true">Read</option>
        <option value="false">Unread</option>
      </select>
      <select
        name="isStarred"
        value={filterByToEdit.isStarred}
        onChange={handleChange}
      >
        <option value="all">All</option>
        <option value="true">Starred</option>
        <option value="false">Unstarred</option>
      </select>
    </form>
  );
}
