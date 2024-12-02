const Test = () => {


  
  return (
    <div>
      <h1>test page</h1>
    </div>
  )
}

export default Test


// import.meta.env.VITE_Host

// const newStartDate = new Date(req.body.startDate);
//   const newEndDate = new Date(req.body.endDate);

//   const isActiveContract =
//     newStartDate <= Date.now() && newEndDate >= Date.now();

//   const isFutureContract = newStartDate>Date.now();


// .test(
//   "is-present-or-future",
//   key("startDateValidation"),
//   function (value) {
//     if (!value) return false;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return new Date(value) >= today;
//   }
// )