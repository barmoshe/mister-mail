import React, { useEffect, useState } from "react";

// <EmailFilter> - allow the user to filter the emails by text & isRead

export function EmailFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  function onSubmitFilter(ev) {
    ev.preventDefault();
    onSetFilter(filterByToEdit);
  }

  function handleChange(ev) {
    let { value, name: field } = ev.target;
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  return (
    <form className="email-filter" onSubmit={onSubmitFilter}>
      <label>
        Search
        <input
          type="text"
          placeholder="Search by text"
          value={filterByToEdit.txt}
          name="txt"
          onChange={handleChange}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={filterByToEdit.isRead}
          name="isRead"
          onChange={handleChange}
        />
        Read
      </label>
      <button>Filter</button>
    </form>
  );
}
