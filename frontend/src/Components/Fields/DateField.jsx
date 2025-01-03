import { useState } from "react";
import DatePicker from "react-multi-date-picker";

//calender
import hijri from "react-date-object/calendars/arabic";
import greogrian from "react-date-object/calendars/gregorian";

//locale
import ArabicHijri from "react-date-object/locales/arabic_ar";
import EnglishHijri from "react-date-object/locales/arabic_en";

import EnglishGeo from "react-date-object/locales/gregorian_en";
import ArabicGeo from "react-date-object/locales/gregorian_ar";

//animation
import transition from "react-element-popper/animations/transition";

import styles from "./Fields.module.css";
import { useTranslation } from "react-i18next";

const DateField = ({ setFieldValue, labelText, value }) => {
  const [isHijriDate, setIsHijriDate] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <label htmlFor="dateOfBirth" className="my-2">
          {labelText}
        </label>
        <ul className={`${styles.date_type_list} my-2 p-0`}>
          <li
            onClick={() => setIsHijriDate(true)}
            className={`${isArLang ? "ms-1" : "me-1"} ${
              isHijriDate ? styles.active_date_type : ""
            }`}
          >
            {key("hijri")}
          </li>
          <li
            onClick={() => setIsHijriDate(false)}
            className={`${isArLang ? "me-1" : "ms-1"} ${
              !isHijriDate ? styles.active_date_type : ""
            }`}
          >
            {key("greogrian")}
          </li>
        </ul>
      </div>

      <DatePicker
        calendar={isHijriDate ? hijri : greogrian}
        locale={
          isArLang
            ? isHijriDate
              ? ArabicHijri
              : ArabicGeo
            : isHijriDate
            ? EnglishHijri
            : EnglishGeo
        }
        animations={[transition()]}
        onChange={(date) => setFieldValue(value, date.format())}
        style={{ padding: "1.5625rem" }}
      />
    </>
  );
};

export default DateField;
