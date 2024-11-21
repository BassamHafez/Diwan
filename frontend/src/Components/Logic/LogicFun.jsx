//contact func

export const renameContactTypeEn = (type) => {
  let name = "";
  switch (type) {
    case "broker":
      name = "Agent";
      break;
    case "tenant":
      name = "tenant";

      break;
    case "landlord":
      name = "landlord";

      break;
    case "service":
      name = "service";
      break;

    default:
      break;
  }
  return name;
};
export const renameContactTypeAr = (type) => {
  let name = "";
  switch (type) {
    case "broker":
      name = "وسيط";
      break;
    case "tenant":
      name = "مستأجر";

      break;
    case "landlord":
      name = "مالك";

      break;
    case "service":
      name = "مزود خدمة";
      break;

    default:
      break;
  }
  return name;
};
export const formatPhoneNumber = (phone) => {
  const countryCode = "+966";
  if (phone.startsWith("0") && phone.length === 10) {
    return `${countryCode}${phone.substring(1)}`;
  }
  return phone;
};

export const formatWhatsAppLink = (phone) => {
  const countryCode = "966";
  if (phone.startsWith("0") && phone.length === 10) {
    phone = phone.substring(1);
  }
  return `https://wa.me/${countryCode}${phone}`;
};

//contract func
export const generatePeriodOptions = (
  unit,
  daysDifference,
  renamedUnit,
  pluralUnit,
  everyWord
) => {
  let values = [];
  switch (unit) {
    case "day":
      values = [1, 2, 3, 7, 14, 30].filter((val) => val <= daysDifference);
      break;
    case "week":
      values = [1, 2, 4, 6, 8].filter((val) => val * 7 <= daysDifference);
      break;
    case "month":
      values = [1, 2, 3, 6, 12].filter((val) => val * 30 <= daysDifference);
      break;
    case "year":
      values = [1, 2, 5, 10].filter((val) => val * 365 <= daysDifference);
      break;
    default:
      values = [];
  }
  return values.map((val) => ({
    label: `${everyWord} ${val !== 1 ? `${val} ${pluralUnit}` : renamedUnit}`,
    value: val,
  }));
};

export const calculateDaysDifference = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInMs = endDate - startDate;
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

export const filterTimeUnitDpendsOnDaysDifference = (
  unitOptions,
  daysDifference,
  isArLang
) => {
  const filteredUnits = unitOptions[isArLang ? "ar" : "en"].filter((unit) => {
    switch (unit.value) {
      case "day":
        return daysDifference >= 1;
      case "week":
        return daysDifference >= 7;
      case "month":
        return daysDifference >= 30;
      case "year":
        return daysDifference >= 365;
      default:
        return false;
    }
  });

  return filteredUnits;
};

export const calculateRevenues = (totalAmount,paymentPeriodValue,paymentPeriodUnit,startDate,endDate) => {
  const revenues = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const unitMultipliers = {
    day: 1,
    week: 7,
    month: 30, 
    year: 365, 
  };

  if (!unitMultipliers[paymentPeriodUnit]) {
    console.error(
      "Invalid paymentPeriodUnit. Use 'day', 'week', 'month', or 'year'"
    );
  }

  const intervalInDays =
    paymentPeriodValue * unitMultipliers[paymentPeriodUnit];

  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const numIntervals = Math.ceil(totalDays / intervalInDays);

  const baseAmount = Math.floor(totalAmount / numIntervals);
  let remainingAmount = totalAmount - baseAmount * numIntervals;

  let currentDate = new Date(start);
  for (let i = 0; i < numIntervals; i++) {
    let amount = baseAmount;
    if (remainingAmount > 0) {
      amount++;
      remainingAmount--;
    }

    revenues.push({
      amount: amount,
      dueDate: new Date(currentDate).toISOString().split("T")[0], // Format date as YYYY-MM-DD,
    });

    currentDate.setDate(currentDate.getDate() + intervalInDays);
  }

  return revenues;
};
