import React, { useState, useContext, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { UserContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";
import "./style.css";

export const SearchUsers: React.FC = () => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [list, setList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createChat } = useChatContext();

  const fetchResults = async () => {
    if (searchTerm === "") {
      setResults([]);
      return;
    }

    try {
      const response = await getRequest(
        `${baseUrl}/search-users?searchTerm=${searchTerm}`
      );
      if (response.error) {
        setError(response.message);
      } else {
        const filteredResults = response.filter(
          (result: any) => result._id !== user?._id
        );
        setResults(filteredResults);
      }
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchResults();
      setList(true);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setResults([]);
      setList(false);
    }
  }, [searchTerm]);

  const handleClick: React.MouseEventHandler<HTMLLIElement> = (event) => {
    // Handle click logic here
    const userId = event.currentTarget.getAttribute("data-userid");
    if (userId) {
      createChat(userId);
    }
  };

  return (
    <div className="searchbar">
      <input
        type="search"
        value={searchTerm}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Search users..."
      />
      {error && <div>{error}</div>}
      <ul className={list ? "true" : ""}>
        {results.map((user) => (
          <li key={user._id} onClick={handleClick} data-userid={user._id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
