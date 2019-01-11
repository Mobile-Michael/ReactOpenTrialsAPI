import React from "react";

const SearchInput = props => {
  return (
    <div className="form-group">
      <label htmlFor="search">Search By Trial Name:</label>
      <input
        type="text"
        className="form-control"
        id="search"
        placeholder="Title"
        onChange={props.changed}
      />
    </div>
  );
};

export default SearchInput;
