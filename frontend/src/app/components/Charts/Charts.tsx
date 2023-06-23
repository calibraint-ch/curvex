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

import './index.scss'

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
    white: "#ffffff",
    primaryBlue: "#2f3ece",
    primaryYellow: "#f3f264",
    pureYellow: "#d5ff00"
  };

  //TODO: Bring in dynamic datasets
  const data = [
    { x: 0, y: 0 },
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
        backgroundColor: chartColors.white,
        borderColor: chartColors.primaryYellow,
        tension: 0.4,
        fill: false,
      },
      {
        label: "Price Range",
        data: [
          {
            x: 30,
            y: 0,
          },
          {
            x: 40,
            y: 0,
          },
          {
            x: 50,
            y: 0,
          },
        ],
        backgroundColor: chartColors.pureYellow,
        borderColor: chartColors.primaryYellow,
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
      y: {
        type: "linear" as const, display: true, grid: {
          color: chartColors.white,
        },
        ticks: {
          color: chartColors.white,
        },
      },
      x: {
        type: "linear" as const, display: true, grid: {
          color: chartColors.white,
        },
        ticks: {
          color: chartColors.white,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="charts">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Charts;
