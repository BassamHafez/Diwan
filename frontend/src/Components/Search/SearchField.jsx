import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styles from "./SearchField.module.css";

const SearchField = ({ onSearch, text }) => {
  const [searchInput, setSearchInput] = useState("");

  const saveSearchData = (e) => {
    setSearchInput(e.target.value);
  };

  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <form
      onSubmit={(e) => onSearch(e, searchInput)}
      className={`${styles.search_container}  ${
        isArLang ? "me-auto" : "ms-auto"
      }`}
    >
      <input onChange={saveSearchData} type="search" placeholder={text} />
      <button
        type="submit"
        className={`${styles.search_icon} ${
          isArLang ? styles.search_icon_ar : styles.search_icon_en
        }`}
      >
        <FontAwesomeIcon title="search" icon={faSearch} />
      </button>
    </form>
  );
};

export default SearchField;