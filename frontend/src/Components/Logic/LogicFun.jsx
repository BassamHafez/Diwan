import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";

// main fun
export const formattedDate = (date) => {
  const parsedDate = new Date(date);
  if (!date || isNaN(parsedDate)) {
    return "-";
  }
  return parsedDate.toISOString().split("T")[0];
};


export const convertTpOptionsFormate = (arr) => {
  let arrOptions = [];
  if (arr?.length > 0) {
    arrOptions = arr.map((val) => {
      return { label: val.name, value: val._id };
    });
  }
  return arrOptions;
};

export const convertNumbersToFixedTwo = (num) => {
  if (!num || !isFinite(num) || isNaN(num)) {
    return 0;
  }
  return Number.isInteger(num) ? num : Number(num).toFixed(2);
};

export const checkAccountFeatures = (accInfo, value) => {
  const feature = accInfo[value];
  return typeof feature === "number" ? feature > 0 : Boolean(feature);
};

export const handleDownloadExcelSheet = (data, name, title) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, `${title}`);

  XLSX.writeFile(wb, `${name}`);
};

export const generatePDF = (id, name) => {
  const element = document.getElementById(`${id}`);
  const options = {
    margin: 2,
    filename: name ? name : "file",
    html2canvas: { scale: 4 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf(element, options);
};

// estates
const estateStatus = {
  en: {
    available: "Available",
    pending: "Pending",
    rented: "Rented",
  },
  ar: {
    available: "شاغرة",
    pending: "معلقة",
    rented: "مؤجرة",
  },
};

export const renamedEstateStatus = (type, language) => {
  const mappings = estateStatus[language];
  return mappings?.[type] || "";
};

//compounds
export const calculateRentedPercentage = (rented, total) => {
  if (!rented || total === 0 || rented === 0) {
    return 0;
  }
  const percentage = (rented / total) * 100;
  if (!percentage || !isFinite(percentage) || isNaN(percentage)) {
    return 0;
  }
  return Number.isInteger(percentage) ? percentage : percentage.toFixed(1) || 0;
};

//contact func
const contactTypeMappings = {
  en: {
    broker: "Agent",
    tenant: "Tenant",
    landlord: "Landlord",
    service: "Service",
  },
  ar: {
    broker: "وسيط",
    tenant: "مستأجر",
    landlord: "مالك",
    service: "مزود خدمة",
  },
};

export const renameContactType = (type, language) => {
  const mappings = contactTypeMappings[language];
  return mappings?.[type] || "";
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

const contractStatus = {
  en: {
    active: "Active",
    upcoming: "Upcoming",
    canceled: "Canceled",
    completed: "completed",
  },
  ar: {
    active: "ساري",
    upcoming: "قادم",
    canceled: "ملغي",
    completed: "مكتمل",
  },
};

export const renamedContractStatus = (type, language) => {
  const mappings = contractStatus[language];
  return mappings?.[type] || "";
};

export const getContractStatus = (isCanceled, startDate, endDate) => {
  if (isCanceled) return "canceled";

  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (currentDate < start) {
    return "upcoming";
  } else if (currentDate >= start && currentDate <= end) {
    return "active";
  } else if (currentDate > end) {
    return "completed";
  }

  return "unknown";
};

// revenues

export const calculateRevenues = (
  totalAmount,
  paymentPeriodValue,
  paymentPeriodUnit,
  startDate,
  endDate
) => {
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
      dueDate: formattedDate(currentDate),
    });

    currentDate.setDate(currentDate.getDate() + intervalInDays);
  }

  return revenues;
};

const revenuesStatus = {
  en: {
    pending: "pending",
    canceled: "canceled",
    paid: "paid",
  },
  ar: {
    pending: "معلق",
    canceled: "ملغي",
    paid: "مدفوع",
  },
};

export const renamedRevenuesStatus = (type, language) => {
  const mappings = revenuesStatus[language];
  return mappings?.[type] || "";
};
const paymentMethod = {
  en: {
    cash: "Cash",
    "bank-transfer": "Bank transfer",
    online: "Online",
  },
  ar: {
    cash: "كاش",
    "bank-transfer": "حوالة بنكية",
    online: "أونلاين",
  },
};

export const renamedPaymentMethod = (type, language) => {
  const mappings = paymentMethod[language];
  return mappings?.[type] || "";
};

export const calculatePeriod = (startDate, endDate, isArLang) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate differences in years, months, weeks, and days
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  // const remainingDaysAfterMonths = remainingDaysAfterYears % 30;
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays;

  // Determine the most suitable unit
  if (years >= 1) {
    return isArLang ? `${years} سنة` : `${years} year${years > 1 ? "s" : ""}`;
  } else if (months >= 1) {
    return isArLang
      ? `${months} شهر`
      : `${months} month${months > 1 ? "s" : ""}`;
  } else if (weeks >= 1) {
    return isArLang ? `${weeks} أسبوع` : `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else {
    return isArLang ? `${days} يوم` : `${days} day${days > 1 ? "s" : ""}`;
  }
};

export const revenueTypes = {
  en: {
    day: "daily",
    week: "weekly",
    month: "monthly",
    year: "annual",
  },
  ar: {
    day: "يومي",
    week: "أسبوعي",
    month: "شهري",
    year: "سنوي",
  },
};

export const renamedRevenuesType = (type, language) => {
  const mappings = revenueTypes[language];
  return mappings?.[type] || "";
};

//expenses
export const expensesStatusOptions = {
  en: {
    pending: "Pending",
    paid: "Paid",
    cancelled: "Cancelled",
  },
  ar: {
    pending: "معلقة",
    paid: "مدفوعة",
    cancelled: "ملغية",
  },
};

export const renamedExpensesStatusMethod = (type, language) => {
  const mappings = expensesStatusOptions[language];
  return mappings?.[type] || "";
};
