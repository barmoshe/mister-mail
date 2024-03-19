import React, { useEffect, useState } from "react";

export function EmailSort({ sortBy, onSetSort }) {
  const [sortByToEdit, setSortByToEdit] = useState(sortBy);

  useEffect(() => {
    onSetSort(sortByToEdit);
  }, [sortByToEdit]);

  function handleSortChange(ev) {
    const { value } = ev.target;
    setSortByToEdit(value);
  }

  return (
    <div className="email-sort">
      <span>Sort by:</span>
      <select
        name="sortBy"
        value={sortByToEdit}
        onChange={(ev) => handleSortChange(ev)}
      >
        <option value="sentAt">sentAt</option>
        <option value="subject">Subject</option>
        <option value="from">From</option>
        <option value="isRead">Read</option>
      </select>
    </div>
  );
}
