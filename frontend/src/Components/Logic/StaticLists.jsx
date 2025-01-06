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
    { label: "Settlement", value: "settlement" },
    { label: "Other", value: "other" },
  ],
  ar: [
    { label: "مستحقات", value: "dues" },
    { label: "مستحقات اضافية", value: "add-due" },
    { label: "رسوم إضافية", value: "extra-fee" },
    { label: "عمولة", value: "commission" },
    { label: "مخالصة", value: "settlement" },
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

//hash images
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

//countries
export const countriesOptions = {
  en: [
    { label: "Afghanistan", value: "Afghanistan-أفغانستان" },
    { label: "Albania", value: "Albania-ألبانيا" },
    { label: "Algeria", value: "Algeria-الجزائر" },
    { label: "Andorra", value: "Andorra-أندورا" },
    { label: "Angola", value: "Angola-أنغولا" },
    {
      label: "Antigua and Barbuda",
      value: "Antigua and Barbuda-أنتيغوا وبربودا",
    },
    { label: "Argentina", value: "Argentina-الأرجنتين" },
    { label: "Armenia", value: "Armenia-أرمينيا" },
    { label: "Australia", value: "Australia-أستراليا" },
    { label: "Austria", value: "Austria-النمسا" },
    { label: "Azerbaijan", value: "Azerbaijan-أذربيجان" },
    { label: "Bahamas", value: "Bahamas-الباهاما" },
    { label: "Bahrain", value: "Bahrain-البحرين" },
    { label: "Bangladesh", value: "Bangladesh-بنغلاديش" },
    { label: "Barbados", value: "Barbados-باربادوس" },
    { label: "Belarus", value: "Belarus-بيلاروسيا" },
    { label: "Belgium", value: "Belgium-بلجيكا" },
    { label: "Belize", value: "Belize-بليز" },
    { label: "Benin", value: "Benin-بنين" },
    { label: "Bhutan", value: "Bhutan-بوتان" },
    { label: "Bolivia", value: "Bolivia-بوليفيا" },
    {
      label: "Bosnia and Herzegovina",
      value: "Bosnia and Herzegovina-البوسنة والهرسك",
    },
    { label: "Botswana", value: "Botswana-بوتسوانا" },
    { label: "Brazil", value: "Brazil-البرازيل" },
    { label: "Brunei", value: "Brunei-بروناي" },
    { label: "Bulgaria", value: "Bulgaria-بلغاريا" },
    { label: "Burkina Faso", value: "Burkina Faso-بوركينا فاسو" },
    { label: "Burundi", value: "Burundi-بوروندي" },
    { label: "Cabo Verde", value: "Cabo Verde-الرأس الأخضر" },
    { label: "Cambodia", value: "Cambodia-كمبوديا" },
    { label: "Cameroon", value: "Cameroon-الكاميرون" },
    { label: "Canada", value: "Canada-كندا" },
    {
      label: "Central African Republic",
      value: "Central African Republic-جمهورية أفريقيا الوسطى",
    },
    { label: "Chad", value: "Chad-تشاد" },
    { label: "Chile", value: "Chile-تشيلي" },
    { label: "China", value: "China-الصين" },
    { label: "Colombia", value: "Colombia-كولومبيا" },
    { label: "Comoros", value: "Comoros-جزر القمر" },
    {
      label: "Congo (Congo-Brazzaville)",
      value: "Congo (Congo-Brazzaville)-الكونغو (برازافيل)",
    },
    { label: "Costa Rica", value: "Costa Rica-كوستاريكا" },
    { label: "Croatia", value: "Croatia-كرواتيا" },
    { label: "Cuba", value: "Cuba-كوبا" },
    { label: "Cyprus", value: "Cyprus-قبرص" },
    {
      label: "Czechia (Czech Republic)",
      value: "Czechia (Czech Republic)-التشيك",
    },
    {
      label: "Democratic Republic of the Congo",
      value: "Democratic Republic of the Congo-جمهورية الكونغو الديمقراطية",
    },
    { label: "Denmark", value: "Denmark-الدنمارك" },
    { label: "Djibouti", value: "Djibouti-جيبوتي" },
    { label: "Dominica", value: "Dominica-دومينيكا" },
    {
      label: "Dominican Republic",
      value: "Dominican Republic-جمهورية الدومينيكان",
    },
    { label: "Ecuador", value: "Ecuador-الإكوادور" },
    { label: "Egypt", value: "Egypt-مصر" },
    { label: "El Salvador", value: "El Salvador-السلفادور" },
    { label: "Equatorial Guinea", value: "Equatorial Guinea-غينيا الاستوائية" },
    { label: "Eritrea", value: "Eritrea-إريتريا" },
    { label: "Estonia", value: "Estonia-إستونيا" },
    {
      label: "Eswatini (fmr. 'Swaziland')",
      value: "Eswatini (fmr. 'Swaziland')-إسواتيني (سوازيلاند سابقًا)",
    },
    { label: "Ethiopia", value: "Ethiopia-إثيوبيا" },
    { label: "Fiji", value: "Fiji-فيجي" },
    { label: "Finland", value: "Finland-فنلندا" },
    { label: "France", value: "France-فرنسا" },
    { label: "Gabon", value: "Gabon-الغابون" },
    { label: "Gambia", value: "Gambia-غامبيا" },
    { label: "Georgia", value: "Georgia-جورجيا" },
    { label: "Germany", value: "Germany-ألمانيا" },
    { label: "Ghana", value: "Ghana-غانا" },
    { label: "Greece", value: "Greece-اليونان" },
    { label: "Grenada", value: "Grenada-غرينادا" },
    { label: "Guatemala", value: "Guatemala-غواتيمالا" },
    { label: "Guinea", value: "Guinea-غينيا" },
    { label: "Guinea-Bissau", value: "Guinea-Bissau-غينيا بيساو" },
    { label: "Guyana", value: "Guyana-غيانا" },
    { label: "Haiti", value: "Haiti-هايتي" },
    { label: "Holy See", value: "Holy See-الكرسي الرسولي" },
    { label: "Honduras", value: "Honduras-هندوراس" },
    { label: "Hungary", value: "Hungary-المجر" },
    { label: "Iceland", value: "Iceland-أيسلندا" },
    { label: "India", value: "India-الهند" },
    { label: "Indonesia", value: "Indonesia-إندونيسيا" },
    { label: "Iran", value: "Iran-إيران" },
    { label: "Iraq", value: "Iraq-العراق" },
    { label: "Ireland", value: "Ireland-أيرلندا" },
    { label: "Italy", value: "Italy-إيطاليا" },
    { label: "Jamaica", value: "Jamaica-جامايكا" },
    { label: "Japan", value: "Japan-اليابان" },
    { label: "Jordan", value: "Jordan-الأردن" },
    { label: "Kazakhstan", value: "Kazakhstan-كازاخستان" },
    { label: "Kenya", value: "Kenya-كينيا" },
    { label: "Kiribati", value: "Kiribati-كيريباس" },
    { label: "Kuwait", value: "Kuwait-الكويت" },
    { label: "Kyrgyzstan", value: "Kyrgyzstan-قيرغيزستان" },
    { label: "Laos", value: "Laos-لاوس" },
    { label: "Latvia", value: "Latvia-لاتفيا" },
    { label: "Lebanon", value: "Lebanon-لبنان" },
    { label: "Lesotho", value: "Lesotho-ليسوتو" },
    { label: "Liberia", value: "Liberia-ليبيريا" },
    { label: "Libya", value: "Libya-ليبيا" },
    { label: "Liechtenstein", value: "Liechtenstein-ليختنشتاين" },
    { label: "Lithuania", value: "Lithuania-ليتوانيا" },
    { label: "Luxembourg", value: "Luxembourg-لوكسمبورغ" },
    { label: "Madagascar", value: "Madagascar-مدغشقر" },
    { label: "Malawi", value: "Malawi-مالاوي" },
    { label: "Malaysia", value: "Malaysia-ماليزيا" },
    { label: "Maldives", value: "Maldives-المالديف" },
    { label: "Mali", value: "Mali-مالي" },
    { label: "Malta", value: "Malta-مالطا" },
    { label: "Marshall Islands", value: "Marshall Islands-جزر مارشال" },
    { label: "Mauritania", value: "Mauritania-موريتانيا" },
    { label: "Mauritius", value: "Mauritius-موريشيوس" },
    { label: "Mexico", value: "Mexico-المكسيك" },
    { label: "Micronesia", value: "Micronesia-ميكرونيزيا" },
    { label: "Moldova", value: "Moldova-مولدوفا" },
    { label: "Monaco", value: "Monaco-موناكو" },
    { label: "Mongolia", value: "Mongolia-منغوليا" },
    { label: "Montenegro", value: "Montenegro-الجبل الأسود" },
    { label: "Morocco", value: "Morocco-المغرب" },
    { label: "Mozambique", value: "Mozambique-موزمبيق" },
    { label: "Myanmar (Burma)", value: "Myanmar (Burma)-ميانمار (بورما)" },
    { label: "Namibia", value: "Namibia-ناميبيا" },
    { label: "Nauru", value: "Nauru-ناورو" },
    { label: "Nepal", value: "Nepal-نيبال" },
    { label: "Netherlands", value: "Netherlands-هولندا" },
    { label: "New Zealand", value: "New Zealand-نيوزيلندا" },
    { label: "Nicaragua", value: "Nicaragua-نيكاراغوا" },
    { label: "Niger", value: "Niger-النيجر" },
    { label: "Nigeria", value: "Nigeria-نيجيريا" },
    { label: "North Korea", value: "North Korea-كوريا الشمالية" },
    { label: "North Macedonia", value: "North Macedonia-مقدونيا الشمالية" },
    { label: "Norway", value: "Norway-النرويج" },
    { label: "Oman", value: "Oman-عمان" },
    { label: "Pakistan", value: "Pakistan-باكستان" },
    { label: "Palau", value: "Palau-بالاو" },
    { label: "Panama", value: "Panama-بنما" },
    {
      label: "Papua New Guinea",
      value: "Papua New Guinea-بابوا غينيا الجديدة",
    },
    { label: "Paraguay", value: "Paraguay-باراغواي" },
    { label: "Peru", value: "Peru-بيرو" },
    { label: "Philippines", value: "Philippines-الفلبين" },
    { label: "Poland", value: "Poland-بولندا" },
    { label: "Portugal", value: "Portugal-البرتغال" },
    { label: "Qatar", value: "Qatar-قطر" },
    { label: "Romania", value: "Romania-رومانيا" },
    { label: "Russia", value: "Russia-روسيا" },
    { label: "Rwanda", value: "Rwanda-رواندا" },
    {
      label: "Saint Kitts and Nevis",
      value: "Saint Kitts and Nevis-سانت كيتس ونيفيس",
    },
    { label: "Saint Lucia", value: "Saint Lucia-سانت لوسيا" },
    {
      label: "Saint Vincent and the Grenadines",
      value: "Saint Vincent and the Grenadines-سانت فنسنت والغرينادين",
    },
    { label: "Samoa", value: "Samoa-ساموا" },
    { label: "San Marino", value: "San Marino-سان مارينو" },
    {
      label: "Sao Tome and Principe",
      value: "Sao Tome and Principe-ساو تومي وبرينسيب",
    },
    { label: "Saudi Arabia", value: "Saudi Arabia-السعودية" },
    { label: "Senegal", value: "Senegal-السنغال" },
    { label: "Serbia", value: "Serbia-صربيا" },
    { label: "Seychelles", value: "Seychelles-سيشيل" },
    { label: "Sierra Leone", value: "Sierra Leone-سيراليون" },
    { label: "Singapore", value: "Singapore-سنغافورة" },
    { label: "Slovakia", value: "Slovakia-سلوفاكيا" },
    { label: "Slovenia", value: "Slovenia-سلوفينيا" },
    { label: "Solomon Islands", value: "Solomon Islands-جزر سليمان" },
    { label: "Somalia", value: "Somalia-الصومال" },
    { label: "South Africa", value: "South Africa-جنوب أفريقيا" },
    { label: "South Korea", value: "South Korea-كوريا الجنوبية" },
    { label: "South Sudan", value: "South Sudan-جنوب السودان" },
    { label: "Spain", value: "Spain-إسبانيا" },
    { label: "Sri Lanka", value: "Sri Lanka-سريلانكا" },
    { label: "Sudan", value: "Sudan-السودان" },
    { label: "Suriname", value: "Suriname-سورينام" },
    { label: "Sweden", value: "Sweden-السويد" },
    { label: "Switzerland", value: "Switzerland-سويسرا" },
    { label: "Syria", value: "Syria-سوريا" },
    { label: "Taiwan", value: "Taiwan-تايوان" },
    { label: "Tajikistan", value: "Tajikistan-طاجيكستان" },
    { label: "Tanzania", value: "Tanzania-تنزانيا" },
    { label: "Thailand", value: "Thailand-تايلاند" },
    { label: "Timor-Leste", value: "Timor-Leste-تيمور الشرقية" },
    { label: "Togo", value: "Togo-توغو" },
    { label: "Tonga", value: "Tonga-تونغا" },
    {
      label: "Trinidad and Tobago",
      value: "Trinidad and Tobago-ترينيداد وتوباغو",
    },
    { label: "Tunisia", value: "Tunisia-تونس" },
    { label: "Turkey", value: "Turkey-تركيا" },
    { label: "Turkmenistan", value: "Turkmenistan-تركمانستان" },
    { label: "Tuvalu", value: "Tuvalu-توفالو" },
    { label: "Uganda", value: "Uganda-أوغندا" },
    { label: "Ukraine", value: "Ukraine-أوكرانيا" },
    {
      label: "United Arab Emirates",
      value: "United Arab Emirates-الإمارات العربية المتحدة",
    },
    { label: "United Kingdom", value: "United Kingdom-المملكة المتحدة" },
    { label: "United States", value: "United States-الولايات المتحدة" },
    { label: "Uruguay", value: "Uruguay-أوروغواي" },
    { label: "Uzbekistan", value: "Uzbekistan-أوزبكستان" },
    { label: "Vanuatu", value: "Vanuatu-فانواتو" },
    { label: "Vatican City", value: "Vatican City-مدينة الفاتيكان" },
    { label: "Venezuela", value: "Venezuela-فنزويلا" },
    { label: "Vietnam", value: "Vietnam-فيتنام" },
    { label: "Yemen", value: "Yemen-اليمن" },
    { label: "Zambia", value: "Zambia-زامبيا" },
    { label: "Zimbabwe", value: "Zimbabwe-زيمبابوي" },
  ],
  ar: [
    { label: "أفغانستان", value: "Afghanistan-أفغانستان" },
    { label: "ألبانيا", value: "Albania-ألبانيا" },
    { label: "الجزائر", value: "Algeria-الجزائر" },
    { label: "أندورا", value: "Andorra-أندورا" },
    { label: "أنغولا", value: "Angola-أنغولا" },
    { label: "أنتيغوا وبربودا", value: "Antigua and Barbuda-أنتيغوا وبربودا" },
    { label: "الأرجنتين", value: "Argentina-الأرجنتين" },
    { label: "أرمينيا", value: "Armenia-أرمينيا" },
    { label: "أستراليا", value: "Australia-أستراليا" },
    { label: "النمسا", value: "Austria-النمسا" },
    { label: "أذربيجان", value: "Azerbaijan-أذربيجان" },
    { label: "الباهاما", value: "Bahamas-الباهاما" },
    { label: "البحرين", value: "Bahrain-البحرين" },
    { label: "بنغلاديش", value: "Bangladesh-بنغلاديش" },
    { label: "باربادوس", value: "Barbados-باربادوس" },
    { label: "بيلاروسيا", value: "Belarus-بيلاروسيا" },
    { label: "بلجيكا", value: "Belgium-بلجيكا" },
    { label: "بليز", value: "Belize-بليز" },
    { label: "بنين", value: "Benin-بنين" },
    { label: "بوتان", value: "Bhutan-بوتان" },
    { label: "بوليفيا", value: "Bolivia-بوليفيا" },
    {
      label: "البوسنة والهرسك",
      value: "Bosnia and Herzegovina-البوسنة والهرسك",
    },
    { label: "بوتسوانا", value: "Botswana-بوتسوانا" },
    { label: "البرازيل", value: "Brazil-البرازيل" },
    { label: "بروناي", value: "Brunei-بروناي" },
    { label: "بلغاريا", value: "Bulgaria-بلغاريا" },
    { label: "بوركينا فاسو", value: "Burkina Faso-بوركينا فاسو" },
    { label: "بوروندي", value: "Burundi-بوروندي" },
    { label: "الرأس الأخضر", value: "Cabo Verde-الرأس الأخضر" },
    { label: "كمبوديا", value: "Cambodia-كمبوديا" },
    { label: "الكاميرون", value: "Cameroon-الكاميرون" },
    { label: "كندا", value: "Canada-كندا" },
    {
      label: "جمهورية أفريقيا الوسطى",
      value: "Central African Republic-جمهورية أفريقيا الوسطى",
    },
    { label: "تشاد", value: "Chad-تشاد" },
    { label: "تشيلي", value: "Chile-تشيلي" },
    { label: "الصين", value: "China-الصين" },
    { label: "كولومبيا", value: "Colombia-كولومبيا" },
    { label: "جزر القمر", value: "Comoros-جزر القمر" },
    {
      label: "الكونغو (برازافيل)",
      value: "Congo (Congo-Brazzaville)-الكونغو (برازافيل)",
    },
    { label: "كوستاريكا", value: "Costa Rica-كوستاريكا" },
    { label: "كرواتيا", value: "Croatia-كرواتيا" },
    { label: "كوبا", value: "Cuba-كوبا" },
    { label: "قبرص", value: "Cyprus-قبرص" },
    { label: "التشيك", value: "Czechia (Czech Republic)-التشيك" },
    {
      label: "جمهورية الكونغو الديمقراطية",
      value: "Democratic Republic of the Congo-جمهورية الكونغو الديمقراطية",
    },
    { label: "الدنمارك", value: "Denmark-الدنمارك" },
    { label: "جيبوتي", value: "Djibouti-جيبوتي" },
    { label: "دومينيكا", value: "Dominica-دومينيكا" },
    {
      label: "جمهورية الدومينيكان",
      value: "Dominican Republic-جمهورية الدومينيكان",
    },
    { label: "الإكوادور", value: "Ecuador-الإكوادور" },
    { label: "مصر", value: "Egypt-مصر" },
    { label: "السلفادور", value: "El Salvador-السلفادور" },
    { label: "غينيا الاستوائية", value: "Equatorial Guinea-غينيا الاستوائية" },
    { label: "إريتريا", value: "Eritrea-إريتريا" },
    { label: "إستونيا", value: "Estonia-إستونيا" },
    {
      label: "إسواتيني (سوازيلاند سابقًا)",
      value: "Eswatini (fmr. 'Swaziland')-إسواتيني (سوازيلاند سابقًا)",
    },
    { label: "إثيوبيا", value: "Ethiopia-إثيوبيا" },
    { label: "فيجي", value: "Fiji-فيجي" },
    { label: "فنلندا", value: "Finland-فنلندا" },
    { label: "فرنسا", value: "France-فرنسا" },
    { label: "الغابون", value: "Gabon-الغابون" },
    { label: "غامبيا", value: "Gambia-غامبيا" },
    { label: "جورجيا", value: "Georgia-جورجيا" },
    { label: "ألمانيا", value: "Germany-ألمانيا" },
    { label: "غانا", value: "Ghana-غانا" },
    { label: "اليونان", value: "Greece-اليونان" },
    { label: "غرينادا", value: "Grenada-غرينادا" },
    { label: "غواتيمالا", value: "Guatemala-غواتيمالا" },
    { label: "غينيا", value: "Guinea-غينيا" },
    { label: "غينيا بيساو", value: "Guinea-Bissau-غينيا بيساو" },
    { label: "غيانا", value: "Guyana-غيانا" },
    { label: "هايتي", value: "Haiti-هايتي" },
    { label: "الكرسي الرسولي", value: "Holy See-الكرسي الرسولي" },
    { label: "هندوراس", value: "Honduras-هندوراس" },
    { label: "المجر", value: "Hungary-المجر" },
    { label: "أيسلندا", value: "Iceland-أيسلندا" },
    { label: "الهند", value: "India-الهند" },
    { label: "إندونيسيا", value: "Indonesia-إندونيسيا" },
    { label: "إيران", value: "Iran-إيران" },
    { label: "العراق", value: "Iraq-العراق" },
    { label: "أيرلندا", value: "Ireland-أيرلندا" },
    { label: "إيطاليا", value: "Italy-إيطاليا" },
    { label: "جامايكا", value: "Jamaica-جامايكا" },
    { label: "اليابان", value: "Japan-اليابان" },
    { label: "الأردن", value: "Jordan-الأردن" },
    { label: "كازاخستان", value: "Kazakhstan-كازاخستان" },
    { label: "كينيا", value: "Kenya-كينيا" },
    { label: "كيريباس", value: "Kiribati-كيريباس" },
    { label: "الكويت", value: "Kuwait-الكويت" },
    { label: "قيرغيزستان", value: "Kyrgyzstan-قيرغيزستان" },
    { label: "لاوس", value: "Laos-لاوس" },
    { label: "لاتفيا", value: "Latvia-لاتفيا" },
    { label: "لبنان", value: "Lebanon-لبنان" },
    { label: "ليسوتو", value: "Lesotho-ليسوتو" },
    { label: "ليبيريا", value: "Liberia-ليبيريا" },
    { label: "ليبيا", value: "Libya-ليبيا" },
    { label: "ليختنشتاين", value: "Liechtenstein-ليختنشتاين" },
    { label: "ليتوانيا", value: "Lithuania-ليتوانيا" },
    { label: "لوكسمبورغ", value: "Luxembourg-لوكسمبورغ" },
    { label: "مدغشقر", value: "Madagascar-مدغشقر" },
    { label: "مالاوي", value: "Malawi-مالاوي" },
    { label: "ماليزيا", value: "Malaysia-ماليزيا" },
    { label: "المالديف", value: "Maldives-المالديف" },
    { label: "مالي", value: "Mali-مالي" },
    { label: "مالطا", value: "Malta-مالطا" },
    { label: "جزر مارشال", value: "Marshall Islands-جزر مارشال" },
    { label: "موريتانيا", value: "Mauritania-موريتانيا" },
    { label: "موريشيوس", value: "Mauritius-موريشيوس" },
    { label: "المكسيك", value: "Mexico-المكسيك" },
    { label: "ميكرونيزيا", value: "Micronesia-ميكرونيزيا" },
    { label: "مولدوفا", value: "Moldova-مولدوفا" },
    { label: "موناكو", value: "Monaco-موناكو" },
    { label: "منغوليا", value: "Mongolia-منغوليا" },
    { label: "الجبل الأسود", value: "Montenegro-الجبل الأسود" },
    { label: "المغرب", value: "Morocco-المغرب" },
    { label: "موزمبيق", value: "Mozambique-موزمبيق" },
    { label: "ميانمار (بورما)", value: "Myanmar (Burma)-ميانمار (بورما)" },
    { label: "ناميبيا", value: "Namibia-ناميبيا" },
    { label: "ناورو", value: "Nauru-ناورو" },
    { label: "نيبال", value: "Nepal-نيبال" },
    { label: "هولندا", value: "Netherlands-هولندا" },
    { label: "نيوزيلندا", value: "New Zealand-نيوزيلندا" },
    { label: "نيكاراغوا", value: "Nicaragua-نيكاراغوا" },
    { label: "النيجر", value: "Niger-النيجر" },
    { label: "نيجيريا", value: "Nigeria-نيجيريا" },
    { label: "جزر مارشال", value: "Marshall Islands-جزر مارشال" },
    { label: "فلسطين", value: "Palestine-فلسطين" },
    { label: "بنما", value: "Panama-بنما" },
    {
      label: "بابوا غينيا الجديدة",
      value: "Papua New Guinea-بابوا غينيا الجديدة",
    },
    { label: "باراغواي", value: "Paraguay-باراغواي" },
    { label: "بيرو", value: "Peru-بيرو" },
    { label: "الفلبين", value: "Philippines-الفلبين" },
    { label: "بولندا", value: "Poland-بولندا" },
    { label: "البرتغال", value: "Portugal-البرتغال" },
    { label: "قطر", value: "Qatar-قطر" },
    { label: "رومانيا", value: "Romania-رومانيا" },
    { label: "روسيا", value: "Russia-روسيا" },
    { label: "رواندا", value: "Rwanda-رواندا" },
    {
      label: "سانت كيتس ونيفيس",
      value: "Saint Kitts and Nevis-سانت كيتس ونيفيس",
    },
    { label: "سانت لوسيا", value: "Saint Lucia-سانت لوسيا" },
    {
      label: "سانت فينسنت والغرينادين",
      value: "Saint Vincent and the Grenadines-سانت فينسنت والغرينادين",
    },
    { label: "ساموا", value: "Samoa-ساموا" },
    { label: "سان مارينو", value: "San Marino-سان مارينو" },
    {
      label: "ساو تومي وبرينسيب",
      value: "São Tomé and Príncipe-ساو تومي وبرينسيب",
    },
    { label: "السعودية", value: "Saudi Arabia-السعودية" },
    { label: "السنغال", value: "Senegal-السنغال" },
    { label: "صربيا", value: "Serbia-صربيا" },
    { label: "سيشل", value: "Seychelles-سيشل" },
    { label: "سيرا ليون", value: "Sierra Leone-سيرا ليون" },
    { label: "سنغافورة", value: "Singapore-سنغافورة" },
    { label: "سلوفاكيا", value: "Slovakia-سلوفاكيا" },
    { label: "سلوفينيا", value: "Slovenia-سلوفينيا" },
    { label: "جزر سليمان", value: "Solomon Islands-جزر سليمان" },
    { label: "الصومال", value: "Somalia-الصومال" },
    { label: "جنوب أفريقيا", value: "South Africa-جنوب أفريقيا" },
    { label: "جنوب السودان", value: "South Sudan-جنوب السودان" },
    { label: "إسبانيا", value: "Spain-إسبانيا" },
    { label: "سريلانكا", value: "Sri Lanka-سريلانكا" },
    { label: "السودان", value: "Sudan-السودان" },
    { label: "سورينام", value: "Suriname-سورينام" },
    { label: "سوازيلاند", value: "Swaziland-سوازيلاند" },
    { label: "السويد", value: "Sweden-السويد" },
    { label: "سويسرا", value: "Switzerland-سويسرا" },
    { label: "سوريا", value: "Syria-سوريا" },
    { label: "تيمور الشرقية", value: "Timor-Leste-تيمور الشرقية" },
    { label: "التوغو", value: "Togo-التوغو" },
    {
      label: "ترينيداد وتوباغو",
      value: "Trinidad and Tobago-ترينيداد وتوباغو",
    },
    { label: "تونس", value: "Tunisia-تونس" },
    { label: "تركيا", value: "Turkey-تركيا" },
    { label: "تركمانستان", value: "Turkmenistan-تركمانستان" },
    { label: "توفالو", value: "Tuvalu-توفالو" },
    { label: "أوغندا", value: "Uganda-أوغندا" },
    { label: "أوكرانيا", value: "Ukraine-أوكرانيا" },
    { label: "الإمارات", value: "United Arab Emirates-الإمارات" },
    { label: "المملكة المتحدة", value: "United Kingdom-المملكة المتحدة" },
    { label: "الولايات المتحدة", value: "United States-الولايات المتحدة" },
    { label: "أوروجواي", value: "Uruguay-أوروجواي" },
    { label: "أوزبكستان", value: "Uzbekistan-أوزبكستان" },
    { label: "فنزويلا", value: "Venezuela-فنزويلا" },
    { label: "فيتنام", value: "Vietnam-فيتنام" },
    { label: "اليمن", value: "Yemen-اليمن" },
    { label: "زامبيا", value: "Zambia-زامبيا" },
    { label: "زيمبابوي", value: "Zimbabwe-زيمبابوي" },
  ],
};

// contacts
export const tenantTypeOptions = {
  en: [
    { label: "individual", value: "individual" },
    { label: "organization", value: "organization" },
  ],
  ar: [
    { label: "فرد", value: "individual" },
    { label: "منشأة", value: "organization" },
  ],
};

export const reportsFiltering = {
  en: [
    { label: "revenues", value: "revenue" },
    { label: "expenses", value: "expense" },
  ],
  ar: [
    { label: "الإيرادات", value: "revenue" },
    { label: "المصروفات", value: "expense" },
  ],
};
