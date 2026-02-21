"use client";

import { debounceInput } from "@/utils/utils.js";
import React, { useState, useMemo, useEffect } from "react";

const SearchBox = ({ setSearch, search }) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Memoize the debounced function so it's not recreated on every render
  const debouncedSetSearch = useMemo(
    () => debounceInput((value) => setSearch(value), 500),
    [setSearch],
  );

  // Update local state and trigger debounced parent update
  const handleChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  // Sync local state if parent search state changes (e.g. cleared from elsewhere)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search notes"
        className="bg-white text-black w-full p-2 border border-gray-300 rounded-md"
        value={localSearch}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
