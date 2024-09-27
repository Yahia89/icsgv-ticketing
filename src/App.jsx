import { useState } from "react";
import eventData from "./assets/data/eventData.json";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(eventData); // Directly use imported JSON data
  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSearchClick = () => {
    setSearchTriggered(true);
  };

  const filteredData = data.filter((item) => {
    const donor = item.Donor ? item.Donor.toLowerCase() : "";
    const ticketNumber = item["Ticket Number"] || "";
    const reference = item.Reference || "";

    return (
      donor.includes(searchTerm.toLowerCase()) ||
      ticketNumber.includes(searchTerm) ||
      reference.includes(searchTerm)
    );
  });

  return (
    <div>
      <p>salam alaikum</p>
      <input
        type="text"
        placeholder="Search by Donor, Ticket Number, or Reference"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSearchTriggered(false);
        }}
      />
      <button onClick={handleSearchClick}>Search</button>

      {searchTriggered && filteredData.length > 0 && (
        <table>
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
        <p>No results found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default SearchBar;
