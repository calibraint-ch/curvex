import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register([
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
]);

const Charts = () => {
  const chartColors = {
    grey: "#f7f7f7",
    primaryBlue: "#2f3ece",
  };

  //TODO: Bring in dynamic datasets
  const data = [
    { x: 10, y: 10 },
    { x: 20, y: 20 },
    { x: 30, y: 30 },
    { x: 40, y: 40 },
    { x: 50, y: 50 },
    { x: 60, y: 60 },
    { x: 70, y: 70 },
  ];

  const chartData = {
    datasets: [
      {
        label: "Price",
        data: data,
        backgroundColor: chartColors.grey,
        borderColor: chartColors.primaryBlue,
        tension: 0.4,
        fill: false,
      },
      {
        label: "Price Range",
        data: [
          {
            x: 40,
            y: 0,
          },
          {
            x: 50,
            y: 0,
          },
          {
            x: 60,
            y: 0,
          },
        ],
        backgroundColor: chartColors.primaryBlue,
        borderColor: chartColors.primaryBlue,
        borderWidth: 0,
        fill: "-1",
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      filler: { propagate: false },
    },
    scales: {
      y: { type: "linear" as const, display: true },
      x: { type: "linear" as const, display: true },
    },
    responsive: true,
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Charts;
