import Chart from 'chart.js/auto';
import { CategoryScale } from "chart.js";
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale);

const Charts = () => {
    const chartData = {
        labels: [10, 20, 30, 40, 50, 60, 70],
        datasets: [
            {
                label: 'Linear Curve',
                data: [10, 20, 30, 40, 50, 60, 70],
                fill: 0,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }
        ],
    }
    return (
        <div>
            <Line data={chartData} />
        </div>
    )
}

export default Charts;