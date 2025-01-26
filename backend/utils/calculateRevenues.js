const { addMonths, differenceInMonths, format } = require("date-fns");

function calculateRevenues(contract) {
  const revenues = [];
  const start = new Date(contract.startDate);
  const end = new Date(contract.endDate);
  const unitMultipliers = {
    day: 1,
    week: 7,
    month: 30,
    year: 365,
  };

  if (!unitMultipliers[contract.paymentPeriodUnit]) {
    throw new Error(
      "Invalid paymentPeriodUnit. Use 'day', 'week', 'month', or 'year'."
    );
  }

  function distributeAmount(totalAmount, periods) {
    const baseAmount = Math.floor(totalAmount / periods);
    let remainingAmount = totalAmount - baseAmount * periods;

    return Array.from({ length: periods }, (_, i) => {
      const amount = baseAmount + (remainingAmount > 0 ? 1 : 0);
      remainingAmount = Math.max(remainingAmount - 1, 0);
      return amount;
    });
  }

  function addRevenueEntries(amounts, getNextDate) {
    let currentDate = new Date(start);

    amounts.forEach((amount) => {
      revenues.push({
        amount,
        dueDate: format(currentDate, "yyyy-MM-dd"),
        contract: contract._id,
        tenant: contract.tenant,
        estate: contract.estate,
        account: contract.account,
        compound: contract.compound || null,
        landlord: contract.landlord || null,
      });

      currentDate = getNextDate(currentDate);
    });
  }

  if (contract.paymentPeriodUnit === "year") {
    const totalYears = end.getFullYear() - start.getFullYear();
    const amounts = distributeAmount(contract.totalAmount, totalYears);

    addRevenueEntries(amounts, (date) => {
      date.setFullYear(date.getFullYear() + 1);
      return date;
    });
  } else if (contract.paymentPeriodUnit === "month") {
    const totalMonths = differenceInMonths(end, start);
    const amounts = distributeAmount(contract.totalAmount, totalMonths);

    addRevenueEntries(amounts, (date) => addMonths(date, 1));
  } else {
    const intervalInDays =
      contract.paymentPeriodValue * unitMultipliers[contract.paymentPeriodUnit];
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const numIntervals = Math.ceil(totalDays / intervalInDays);
    const amounts = distributeAmount(contract.totalAmount, numIntervals);

    addRevenueEntries(amounts, (date) => {
      date.setDate(date.getDate() + intervalInDays);
      return date;
    });
  }

  return revenues;
}

module.exports = calculateRevenues;
