import Chart from "react-apexcharts";

const TotalExAndRev = () => {
  const chartData = {
    options: {
      chart: {
        id: "revenue-expense-bar",
      },
      xaxis: {
        categories: [
          "Paid Revenues",
          "Pending Revenues",
          "Paid Expenses",
          "Pending Expenses",
        ],
      },
      colors: ["#4caf50", "#f44336", "#2196f3", "#ff9800"], // Custom colors
    },
    series: [
      {
        name: "Amount",
        data: [25500, 15000, 1045, 7600], // Values from your data
      },
    ],
  };

  return (
    <div>
      <h2>Revenue and Expense Overview</h2>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width="600"
      />
    </div>
  );
};

export default TotalExAndRev;
