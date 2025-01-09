const Test = () => {
  return (
    <div
      style={{ backgroundColor: "#F7F7FC", overflowX: "hidden" }}
      className="py-5"
    ></div>
  );
};

export default Test;

// const handleCityChange = (selectedCity, setFieldValue) => {
//   setFieldValue("city", selectedCity?.value || "");
//   setFieldValue("neighborhood", "");
//   let districts;
//   if (isArLang) {
//     districts = districtsByCityAr[selectedCity?.value] || [];
//   } else {
//     districts = districtsByCity[selectedCity?.value] || [];
//   }
//   let finalDistricts = [
//     { label: key("notSpecified"), value: "not specified" },
//     ...districts,
//   ];
//   setDistrictOptions(finalDistricts);
// };

{
  /* <Select
                    options={districtOptions}
                    onChange={(selected) =>
                      setFieldValue("neighborhood", selected?.value)
                    }
                    value={
                      districtOptions.find(
                        (opt) => opt.value === values.neighborhood
                      ) || null
                    }
                    isDisabled={!values.city}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                  /> */
}

//estate image and compound image 3:2

// .matches(/^(1|2)\d{9}$/, key("nationalIdValidation"))

// import ArabicGeo from "react-date-object/locales/gregorian_ar";
// import ArabicHijri from "react-date-object/locales/arabic_ar";

// .test(
//   "is-present-or-future",
//   key("startDateValidation"),
//   function (value) {
//     if (!value) return false;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return new Date(value) >= today;
//   }
// ),

{
  /* <Col
      xs={6}
      sm={4}
      md={6}
      className="d-flex justify-content-center align-items-center"
                            >
      <div className={styles.main_details}>
        <span>{key("totalIncome2")}</span>
        <p>
          {convertNumbersToFixedTwo(
            theCommissionVal + netIncomeVal
          )}{" "}
          {key("sarSmall")}
        </p>
      </div>
   </Col> */
}

// <input
//   type="radio"
//   className="btn-check"
//   name="status"
//   id="reservedSmall"
//   value="pending"
//   autoComplete="off"
//   checked={statusFiltering === "pending"}
//   onChange={(e) => handleFilterChange(e, "status")}
// />
// <label
//   className={`${
//     statusFiltering === "pending" && styles.label_checked
//   } btn`}
//   htmlFor="reservedSmall"
// >
//   {key("pending")}
// </label>

// <div className="form-check">
//   <input
//     className={`${styles.filter_input} form-check-input`}
//     type="radio"
//     name="statusSelection"
//     value="pending"
//     id="pending"
//     checked={statusFiltering === "pending"}
//     onChange={(e) => handleFilterChange(e, "status")}
//   />
//   <label
//     className={`form-check-label ${styles.filter_label}`}
//     htmlFor="pending"
//   >
//     {key("pending")}
//   </label>
// </div>

//   <AccordionContent
//   removeTitle={true}
//   title={key("Contracts")}
//   icon={Contracts}
//   eventKey="2"
// >
//   <div className="form-check">
//     <input
//       className={`${styles.filter_input} form-check-input`}
//       type="radio"
//       name="ContractsSelection"
//       value="nextMonth"
//       id="nextMonth"
//     />
//     <label
//       className={`form-check-label ${styles.filter_label}`}
//       htmlFor="nextMonth"
//     >
//       {key("nextMonth")}
//     </label>
//   </div>

//   <div className="form-check">
//     <input
//       className={`${styles.filter_input} form-check-input`}
//       type="radio"
//       name="ContractsSelection"
//       value="next3Month"
//       id="next3Month"
//     />
//     <label
//       className={`form-check-label ${styles.filter_label}`}
//       htmlFor="next3Month"
//     >
//       {key("next3Month")}
//     </label>
//   </div>
// </AccordionContent>

//   <div className={smallFilterClass}>
//   <h5>{key("Contracts")}</h5>
//   <input
//     type="radio"
//     className="btn-check"
//     name="Contracts"
//     id="nextMonthSmall"
//     autoComplete="off"
//     value="nextMonth"
//   />
//   <label className="btn" htmlFor="nextMonthSmall">
//     {key("nextMonth")}
//   </label>

//   <input
//     type="radio"
//     className="btn-check"
//     name="Contracts"
//     id="next3MonthSmall"
//     value="next3Month"
//     autoComplete="off"
//   />
//   <label className="btn" htmlFor="next3MonthSmall">
//     {key("next3Month")}
//   </label>
// </div>
