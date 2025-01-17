import React from "react";
import { FiSearch } from "react-icons/fi";

const ChatFullSearch = ({ placeholder = "Search...", onSearch }) => {
  const handleInputChange = (event) => {
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <div className="w-full flex max-h-20 items-center bg-white rounded-3xl px-4 py-4 shadow-md shadow-blue-200">
      <FiSearch className="text-gray-500 text-xl mr-2" />

      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default ChatFullSearch;
