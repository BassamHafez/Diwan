const Test = () => {
  return (
    <div
      style={{ backgroundColor: "#F7F7FC", overflowX: "hidden" }}
      className="py-5"
    >

    </div>
  );
};

export default Test;



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