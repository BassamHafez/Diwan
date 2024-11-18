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
