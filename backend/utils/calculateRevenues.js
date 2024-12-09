function calculateRevenues(contract) {
  const revenues = [];
  const start = new Date(contract.startDate);
  const end = new Date(contract.endDate);
  const unitMultipliers = {
    day: 1,
    week: 7,
    month: 30, // Approximation
    year: 365, // Approximation
  };

  if (!unitMultipliers[contract.paymentPeriodUnit]) {
    throw new Error(
      "Invalid paymentPeriodUnit. Use 'day', 'week', 'month', or 'year'."
    );
  }

  // Calculate the interval in days
  const intervalInDays =
    contract.paymentPeriodValue * unitMultipliers[contract.paymentPeriodUnit];

  // Calculate total intervals
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const numIntervals = Math.ceil(totalDays / intervalInDays);

  // Distribute the contract.totalAmount
  const baseAmount = Math.floor(contract.totalAmount / numIntervals);
  let remainingAmount = contract.totalAmount - baseAmount * numIntervals;

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
      contract: contract._id,
      tenant: contract.tenant,
      estate: contract.estate,
      account: contract.account,
    });

    // Move to the next due date
    currentDate.setDate(currentDate.getDate() + intervalInDays);
  }

  return revenues;
}

// // Example usage:
// console.log(calculateRevenues(1009, 1, "month", "2024-11-20", "2025-01-19"));
// console.log(calculateRevenues(1009, 2, "month", "2024-11-20", "2025-01-19"));

module.exports = calculateRevenues;
