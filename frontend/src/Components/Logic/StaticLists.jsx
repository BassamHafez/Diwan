//main
export const mainAlertTime = 30 * 60 * 1000;
export const maxFileSize = 20 * 1024 * 1024;
// packages
export const packagesDuration = {
  en: [
    { label: "Month", value: 1 },
    { label: "3 Months", value: 3 },
    { label: "6 Months", value: 6 },
    { label: "Year", value: 12 },
  ],
  ar: [
    { label: "شهرية", value: 1 },
    { label: "ربع سنوية", value: 3 },
    { label: "نصف سنوية", value: 6 },
    { label: "سنوية", value: 12 },
  ],
};
//custom package
export const customPackage = {
  _id: "1",
  arTitle: "باقة مخصصة",
  enTitle: "Custom Package",
  features: [
    { label: "customPackageMSg1", value: "false" },
    { label: "customPackageMSg2", value: "false" },
    { label: "customPackageMSg3", value: "false" },
  ],
};
export const maxEstatesInCompoundOriginalOptions = [
  { label: "3", value: 3 },
  { label: "10", value: 10 },
  { label: "30", value: 30 },
  { label: "50", value: 50 },
  { label: "300", value: 300 },
];

//contract
export const contractStatusOptions = {
  en: [
    { label: "Active", value: "active" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "canceled" },
  ],
  ar: [
    { label: "ساري", value: "active" },
    { label: "قادم", value: "upcoming" },
    { label: "مكتمل", value: "completed" },
    { label: "ملغي", value: "canceled" },
  ],
};
export const unitOptions = {
  en: [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ],
  ar: [
    { label: "يومي", value: "day" },
    { label: "أسبوعي", value: "week" },
    { label: "شهري", value: "month" },
    { label: "سنوي", value: "year" },
  ],
};

//revenues
export const revenueTypeOptions = {
  en: [
    { label: "Add-due", value: "add-due" },
    { label: "Extra-Fee", value: "extra-fee" },
    { label: "Commission", value: "commission" },
    { label: "Other", value: "other" },
  ],
  ar: [
    { label: "مستحقات اضافية", value: "add-due" },
    { label: "رسوم إضافية", value: "extra-fee" },
    { label: "عمولة", value: "commission" },
    { label: "أخرى", value: "other" },
  ],
};

export const revenueFilterTypeOptions = {
  en: [
    { label: "Dues", value: "dues" },
    { label: "Add-due", value: "add-due" },
    { label: "Extra-Fee", value: "extra-fee" },
    { label: "Commission", value: "commission" },
    { label: "Other", value: "other" },
  ],
  ar: [
    { label: "مستحقات", value: "dues" },
    { label: "مستحقات اضافية", value: "add-due" },
    { label: "رسوم إضافية", value: "extra-fee" },
    { label: "عمولة", value: "commission" },
    { label: "أخرى", value: "other" },
  ],
};

export const revenuesStatus = {
  en: [
    { label: "pending", value: "pending" },
    { label: "canceled", value: "canceled" },
    { label: "paid", value: "paid" },
  ],
  ar: [
    { label: "معلق", value: "pending" },
    { label: "ملغي", value: "canceled" },
    { label: "مدفوع", value: "paid" },
  ],
};

export const paymentMethodOptions = {
  en: [
    { label: "Cash", value: "cash" },
    { label: "Bank transfer", value: "bank-transfer" },
    { label: "Online", value: "online" },
  ],
  ar: [
    { label: "كاش", value: "cash" },
    { label: "حوالة بنكية", value: "bank-transfer" },
    { label: "أونلاين", value: "online" },
  ],
};

export const estateStatus = {
  en: [
    { label: "Available", value: "available" },
    { label: "Pending", value: "pending" },
    { label: "Rented", value: "rented" },
  ],
  ar: [
    { label: "شاغرة", value: "available" },
    { label: "معلقة", value: "pending" },
    { label: "مؤجرة", value: "rented" },
  ],
};

//tasks

export const taskTypeOptions = {
  en: [
    { label: "Maintenance", value: "maintenance" },
    { label: "Purchases", value: "purchases" },
    { label: "Reminder", value: "reminder" },
    { label: "Other", value: "other" },
  ],
  ar: [
    { label: "صيانة", value: "maintenance" },
    { label: "مشتريات", value: "purchases" },
    { label: "تذكير", value: "reminder" },
    { label: "أخري", value: "other" },
  ],
};

export const prioritysOptions = {
  en: [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ],
  ar: [
    { label: "منخفضة", value: "low" },
    { label: "متوسطة", value: "medium" },
    { label: "عالية", value: "high" },
  ],
};

//expenses
export const expensesStatusOptions = {
  en: [
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Cancelled", value: "cancelled" },
  ],
  ar: [
    { label: "معلقة", value: "pending" },
    { label: "مدفوعة", value: "paid" },
    { label: "ملغية", value: "cancelled" },
  ],
};

export const expensesTypeOptions = {
  en: [
    { label: "Maintenance", value: "maintenance" },
    { label: "Purchases", value: "purchases" },
    { label: "Other", value: "other" },
  ],
  ar: [
    { label: "صيانة", value: "maintenance" },
    { label: "مشتريات", value: "purchases" },
    { label: "أخري", value: "other" },
  ],
};
// ----------------------------------------------------------Saudi Arabia----------------------------
//saudi arabia En
export const SaudiRegion = [
  { label: "Riyadh", value: "Riyadh" },
  { label: "Makkah", value: "Makkah" },
  { label: "Al-Madinah", value: "Madinah" },
  { label: "Al-Qassim", value: "Al-Qassim" },
  { label: "Eastern", value: "Eastern" },
  { label: "Asir", value: "Asir" },
  { label: "Tabuk", value: "Tabuk" },
  { label: "Najran", value: "Najran" },
  { label: "Jazan", value: "Jazan" },
];

export const citiesByRegion = {
  Riyadh: [
    { label: "Al Malaz", value: "Al Malaz" },
    { label: "Al Olaya", value: "Al Olaya" },
    { label: "Al Khuzama", value: "Al Khuzama" },
    { label: "Diriyah", value: "Diriyah" },
  ],
  Makkah: [
    { label: "Jeddah", value: "Jeddah" },
    { label: "Taif", value: "Taif" },
    { label: "Rabigh", value: "Rabigh" },
    { label: "Mina", value: "Mina" },
  ],
  Madinah: [
    { label: "Yanbu", value: "Yanbu" },
    { label: "Al-Ula", value: "Al-Ula" },
    { label: "Khaybar", value: "Khaybar" },
    { label: "Badr", value: "Badr" },
  ],
  "Al-Qassim": [
    { label: "Buraydah", value: "Buraydah" },
    { label: "Unaizah", value: "Unaizah" },
    { label: "Al Rass", value: "Al Rass" },
    { label: "Al Bukayriyah", value: "Al Bukayriyah" },
  ],
  Eastern: [
    { label: "Dammam", value: "Dammam" },
    { label: "Al Khobar", value: "Al Khobar" },
    { label: "Dhahran", value: "Dhahran" },
    { label: "Jubail", value: "Jubail" },
  ],
  Asir: [
    { label: "Abha", value: "Abha" },
    { label: "Khamis Mushait", value: "Khamis Mushait" },
    { label: "Bisha", value: "Bisha" },
    { label: "Al Namas", value: "Al Namas" },
  ],
  Tabuk: [
    { label: "Tabuk", value: "Tabuk" },
    { label: "Duba", value: "Duba" },
    { label: "Haql", value: "Haql" },
    { label: "Al Wajh", value: "Al Wajh" },
  ],
  Najran: [
    { label: "Najran", value: "Najran" },
    { label: "Sharurah", value: "Sharurah" },
  ],
  Jazan: [
    { label: "Jazan", value: "Jazan" },
    { label: "Sabya", value: "Sabya" },
    { label: "Abu Arish", value: "Abu Arish" },
  ],
};

export const districtsByCity = {
  "Al Malaz": [
    { label: "Al Faisaliah", value: "Al Faisaliah" },
    { label: "Al Nahdah", value: "Al Nahdah" },
  ],
  "Al Olaya": [
    { label: "King Fahd District", value: "King Fahd District" },
    { label: "Sulaimaniah", value: "Sulaimaniah" },
  ],
  Jeddah: [
    { label: "Al Salamah", value: "Al Salamah" },
    { label: "Al Hamra", value: "Al Hamra" },
    { label: "Al Rawdah", value: "Al Rawdah" },
  ],
  Taif: [
    { label: "Al Hawiyah", value: "Al Hawiyah" },
    { label: "Al Shafa", value: "Al Shafa" },
  ],
  Yanbu: [
    { label: "Yanbu Al Sinaiyah", value: "Yanbu Al Sinaiyah" },
    { label: "Al Aziziyah", value: "Al Aziziyah" },
  ],
  Abha: [
    { label: "Al Manhal", value: "Al Manhal" },
    { label: "Al Rabwah", value: "Al Rabwah" },
  ],
  Dammam: [
    { label: "Al Faisaliah", value: "Al Faisaliah" },
    { label: "Al Shatea", value: "Al Shatea" },
  ],
  "Al Khobar": [
    { label: "Al Aqrabiyah", value: "Al Aqrabiyah" },
    { label: "Al Khuzama", value: "Al Khuzama" },
  ],
  Najran: [
    { label: "Al Faysaliah", value: "Al Faysaliah" },
    { label: "Al Dawasir", value: "Al Dawasir" },
  ],
  Jazan: [
    { label: "Al Rawdah", value: "Al Rawdah" },
    { label: "Al Safa", value: "Al Safa" },
  ],
};

//saudi arabia Ar
export const SaudiRegionAr = [
  { label: "الرياض", value: "الرياض" },
  { label: "مكة", value: "مكة" },
  { label: "المدينة المنورة", value: "المدينة المنورة" },
  { label: "القصيم", value: "القصيم" },
  { label: "المنطقة الشرقية", value: "المنطقة الشرقية" },
  { label: "عسير", value: "عسير" },
  { label: "تبوك", value: "تبوك" },
  { label: "نجران", value: "نجران" },
  { label: "جازان", value: "جازان" },
];

export const citiesByRegionAr = {
  الرياض: [
    { label: "الملز", value: "الملز" },
    { label: "العليا", value: "العليا" },
    { label: "الخزامى", value: "الخزامى" },
    { label: "الدرعية", value: "الدرعية" },
  ],
  مكة: [
    { label: "جدة", value: "جدة" },
    { label: "الطائف", value: "الطائف" },
    { label: "رابغ", value: "رابغ" },
    { label: "منى", value: "منى" },
  ],
  "المدينة المنورة": [
    { label: "ينبع", value: "ينبع" },
    { label: "العلا", value: "العلا" },
    { label: "خيبر", value: "خيبر" },
    { label: "بدر", value: "بدر" },
  ],
  القصيم: [
    { label: "بريدة", value: "بريدة" },
    { label: "عنيزة", value: "عنيزة" },
    { label: "الرس", value: "الرس" },
    { label: "البكيرية", value: "البكيرية" },
  ],
  "المنطقة الشرقية": [
    { label: "الدمام", value: "الدمام" },
    { label: "الخبر", value: "الخبر" },
    { label: "الظهران", value: "الظهران" },
    { label: "الجبيل", value: "الجبيل" },
  ],
  عسير: [
    { label: "أبها", value: "أبها" },
    { label: "خميس مشيط", value: "خميس مشيط" },
    { label: "بيشة", value: "بيشة" },
    { label: "النماص", value: "النماص" },
  ],
  تبوك: [
    { label: "تبوك", value: "تبوك" },
    { label: "ضباء", value: "ضباء" },
    { label: "حقل", value: "حقل" },
    { label: "الوجه", value: "الوجه" },
  ],
  نجران: [
    { label: "نجران", value: "نجران" },
    { label: "شرورة", value: "شرورة" },
  ],
  جازان: [
    { label: "جازان", value: "جازان" },
    { label: "صبيا", value: "صبيا" },
    { label: "أبو عريش", value: "أبو عريش" },
  ],
};

export const districtsByCityAr = {
  الملز: [
    { label: "الفيصلية", value: "الفيصلية" },
    { label: "النهضة", value: "النهضة" },
  ],
  العليا: [
    { label: "حي الملك فهد", value: "حي الملك فهد" },
    { label: "السليمانية", value: "السليمانية" },
  ],
  جدة: [
    { label: "السلامة", value: "السلامة" },
    { label: "الحمرا", value: "الحمرا" },
    { label: "الروضة", value: "الروضة" },
  ],
  الطائف: [
    { label: "الحوية", value: "الحوية" },
    { label: "الشفا", value: "الشفا" },
  ],
  ينبع: [
    { label: "ينبع الصناعية", value: "ينبع الصناعية" },
    { label: "العزيزية", value: "العزيزية" },
  ],
  أبها: [
    { label: "المنهل", value: "المنهل" },
    { label: "الربوة", value: "الربوة" },
  ],
  الدمام: [
    { label: "الفيصلية", value: "الفيصلية" },
    { label: "الشاطئ", value: "الشاطئ" },
  ],
  الخبر: [
    { label: "العقربية", value: "العقربية" },
    { label: "الخزامى", value: "الخزامى" },
  ],
  نجران: [
    { label: "الفيصلية", value: "الفيصلية" },
    { label: "الدواسر", value: "الدواسر" },
  ],
  جازان: [
    { label: "الروضة", value: "الروضة" },
    { label: "الصفا", value: "الصفا" },
  ],
};

export const imgHash = {
  hero1: "LwLg@SIpofof?wM|WBj[IrogofWB",
  hero2: "LMGAOxt7.9R:A#ogIToL9aWAn~oI",
  about1: "LXFZ7-D%xs%2uPM|%LNHt-M{V@bc",
  about2: "LD9@9W%MAbS4*JpIsoxC%~xujFWC",
  defaultImg: "LSMZ?q9Ge.WB?w%1xvRj-:aeM{t7",
};

//Reports
export const incomeReportTable = ["category", "estate", "total"];
export const incomeReportDetailsTable = [
  "category",
  "estate",
  // "compound",
  "theTenant",
  // "startContract",
  "type",
  "total",
  // "theCommission",
  // "recipient",
  "recDate",
  "recMethod",
  // "notes",
];
export const paymentsReportTable = [
  "category",
  "estate",
  // "compound",
  "theTenant",
  "dueDate",
  "type",
  "total",
  "status",
  // "recipient",
  "recDate",
  "recMethod",
  "notes",
];
export const contractsReportTable = [
  "estate",
  "theTenant",
  "startDate",
  "endDate",
  "amount",
  "status",
];
export const compoundsReportTable = ["category", "estate", "total"];

//support
export const supportMessagesStatusOptions = {
  en: [
    { label: "processing", value: "processing" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Archived", value: "archived" },
  ],
  ar: [
    { label: "جارية", value: "processing" },
    { label: "معلقة", value: "pending" },
    { label: "مكتملة", value: "completed" },
    { label: "مؤرشفة", value: "archived" },
  ],
};

//dummy data
export const chartsData = [
  { totalPaid: 700, totalPending: 200, month: 1 },
  { totalPaid: 900, totalPending: 1500, month: 2 },
  { totalPaid: 1000, totalPending: 200, month: 3 },
  { totalPaid: 800, totalPending: 300, month: 4 },
  { totalPaid: 500, totalPending: 1000, month: 5 },
  { totalPaid: 1200, totalPending: 1600, month: 6 },
  { totalPaid: 1600, totalPending: 300, month: 7 },
  { totalPaid: 900, totalPending: 800, month: 8 },
  { totalPaid: 1500, totalPending: 1200, month: 9 },
  { totalPaid: 400, totalPending: 200, month: 10 },
  { totalPaid: 1800, totalPending: 1100, month: 11 },
  { totalPaid: 1800, totalPending: 1100, month: 12 },
];
