import { useState } from "react";
import { EmailFilter } from "./EmailFilter";
import { EmailSort } from "./EmailSort";

export function EmailActions({ filterBy, onSetFilter, sortBy, onSetSort }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
  const [sortByToEdit, setSortByToEdit] = useState(sortBy);

  return (
    <div className="emails-actions">
      <EmailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
      <EmailSort sortBy={sortBy} onSetSort={onSetSort} />
    </div>
  );
}
