import { useState, useEffect } from "react";
import eventData from "./assets/data/eventData.json";
import './app.css';
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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
  const [data, setData] = useState(eventData);
  const [filteredData, setFilteredData] = useState([]);
  const [checkedInStatus, setCheckedInStatus] = useState({});
  const [loadingCheckIn, setLoadingCheckIn] = useState({});
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Fetch checked-in tickets from Firestore
  const fetchCheckedInTickets = async () => {
    try {
      const checkInsSnapshot = await getDocs(collection(db, "checkIns"));
      const checkIns = {};
      checkInsSnapshot.forEach((doc) => {
        const data = doc.data();
        checkIns[data.ticketNumber] = true;
      });
      setCheckedInStatus(checkIns);
    } catch (error) {
      console.error("Error fetching checked-in tickets: ", error);
    }
  };

  useEffect(() => {
    fetchCheckedInTickets();
  }, []);

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      setSearchTriggered(true);
    } else {
      setFilteredData([]);
      setSearchTriggered(false);
    }
  };
  
  

  const handleClearClick = () => {
    setSearchTerm("");
    setFilteredData([]);
    setSearchTriggered(false);
  };

  // Check if the ticket is already checked in
  const checkIfAlreadyCheckedIn = async (ticketNumber) => {
    const checkInQuery = query(
      collection(db, "checkIns"),
      where("ticketNumber", "==", ticketNumber)
    );
    const querySnapshot = await getDocs(checkInQuery);
    return !querySnapshot.empty;
  };

  const handleCheckIn = async (item) => {
    const ticketNumber = item["Ticket Number"];
    const isAlreadyCheckedIn = await checkIfAlreadyCheckedIn(ticketNumber);

    if (isAlreadyCheckedIn) {
      return; // Exit if already checked in
    }

    setLoadingCheckIn((prev) => ({ ...prev, [ticketNumber]: true }));

    try {
      await addDoc(collection(db, "checkIns"), {
        donor: item.Donor || "N/A",
        ticketNumber: ticketNumber || "N/A",
        reference: item.Reference || "N/A",
        ticketType: item["Ticket Type"] || "N/A",
        checkInTime: new Date().toISOString(),
      });

      setCheckedInStatus((prevStatus) => ({
        ...prevStatus,
        [ticketNumber]: true,
      }));
    } catch (error) {
      console.error("Error checking in: ", error);
    } finally {
      setLoadingCheckIn((prev) => ({ ...prev, [ticketNumber]: false }));
    }
  };

  useEffect(() => {
    const handleFilter = () => {
      if (searchTerm.trim()) {  // Only filter if searchTerm is not empty
        const results = data.filter((item) => {
          const donor = item.Donor ? item.Donor.toLowerCase() : "";
          const ticketNumber = item["Ticket Number"] || "";
          const reference = item.Reference || "";
          const ticketType = item["Ticket Type"] ? item["Ticket Type"].toLowerCase() : "";
  
          return (
            donor.includes(searchTerm.toLowerCase()) ||
            ticketNumber.includes(searchTerm) ||
            reference.includes(searchTerm) ||
            ticketType.includes(searchTerm.toLowerCase())
          );
        });
        setFilteredData(results);
      } else {
        setFilteredData([]);  // Clear results if searchTerm is empty
      }
    };
  
    const debouncedHandleFilter = debounce(handleFilter, 300);
    debouncedHandleFilter();
  }, [searchTerm, data]);
  
  

  return (
    <div className="search-container">
      <img className="logo" src="https://github.com/Yahia89/icsgv-ticketing/blob/main/src/assets/data/logo-icsgv.png?raw=true" alt="Islamic Center Logo" />
      <p>Salam Alaikum</p>
      <p>Search by Donor's Name, Ticket Number, or Reference</p>
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
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>Donor</th>
          <th>Ticket Number</th>
          <th>Reference</th>
          <th>Ticket Type</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item) => {
          const ticketNumber = item["Ticket Number"];
          const isCheckedIn = checkedInStatus[ticketNumber];
          const isLoading = loadingCheckIn[ticketNumber];

          return (
            <tr key={ticketNumber}>
              <td>{item.Donor || "N/A"}</td>
              <td>{ticketNumber || "N/A"}</td>
              <td>{item.Reference || "N/A"}</td>
              <td>{item["Ticket Type"] || "N/A"}</td>
              <td>
                <button
                  onClick={() => handleCheckIn(item)}
                  className={`check-in-button ${isCheckedIn ? "checked-in" : ""}`}
                  disabled={isCheckedIn || isLoading}
                >
                  {isLoading ? "Loading..." : isCheckedIn ? "✔️ Checked In" : "Check In"}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}


      {searchTriggered && filteredData.length === 0 && (
        <p className="no-results">No results found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default SearchBar;
