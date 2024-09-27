import { useState, useEffect } from "react";
import eventData from "./assets/data/eventData.json";
import './app.css'; // Ensure to import the CSS file

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(eventData); // Directly use imported JSON data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSearchClick = () => {
    setSearchTriggered(true);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    setFilteredData([]); // Clear the filtered data
    setSearchTriggered(false); // Reset the search triggered state
  };

  useEffect(() => {
    const handleFilter = () => {
      const results = data.filter((item) => {
        const donor = item.Donor ? item.Donor.toLowerCase() : "";
        const ticketNumber = item["Ticket Number"] || "";
        const reference = item.Reference || "";

        return (
          donor.includes(searchTerm.toLowerCase()) ||
          ticketNumber.includes(searchTerm) ||
          reference.includes(searchTerm)
        );
      });
      setFilteredData(results);
    };

    const debouncedHandleFilter = debounce(handleFilter, 300);
    debouncedHandleFilter();
  }, [searchTerm, data]);

  return (
    <div className="search-container">
      <img className="logo" src="https://github.com/Yahia89/icsgv-ticketing/blob/main/src/assets/data/logo-icsgv.png?raw=true" alt="islamic center of san gabriel valley logo" />
      <p>salam alaikum</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Search by Donor, Ticket Number, or Reference"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearchTriggered(false);
          }}
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          Search
        </button>
        <button onClick={handleClearClick} className="clear-button">
          Clear
        </button>
      </div>

      {searchTriggered && filteredData.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Ticket Number</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item["Ticket Number"]}>
                <td>{item.Donor || "N/A"}</td>
                <td>{item["Ticket Number"] || "N/A"}</td>
                <td>{item.Reference || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {searchTriggered && filteredData.length === 0 && (
        <p className="no-results">No results found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default SearchBar;
