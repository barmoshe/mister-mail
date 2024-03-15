import { useEffect } from "react";

import { isEqual } from "../../services/util.service";

export function useFilteredSearchParams(searchParams, setSearchParams) {
  useEffect(() => {
    const filteredSearchParams = {};

    // Filter out empty or null parameters
    searchParams.forEach((value, key) => {
      if (value !== "" && value !== null && key !== "folder") {
        filteredSearchParams[key] = value;
      }
    });
    console.log("filteredSearchParams", filteredSearchParams);

    // Update the search parameters if they are different
    if (!isEqual(filteredSearchParams, searchParams)) {
      setSearchParams(filteredSearchParams);
    }
  }, [searchParams, setSearchParams]);
}
