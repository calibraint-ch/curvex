import "./index.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export type GraphProps = {
  cap: number;
  increment: number;
  type: string;
  previewOnly: boolean;
  slope?: number;
  intercept?: number;
  legend?: boolean;
};

export enum CurveTypes {
  linear = "linear",
  polynomial = "polynomial",
  subLinear = "subLinear",
  sCurve = "sCurve",
}

export type dataType = {
  totalSupply: number;
  price: number;
};

const Graph = (props: GraphProps) => {
  const {
    cap,
    increment,
    slope,
    intercept,
    type,
    legend = false,
    previewOnly,
  } = props;
  const data: dataType[] = [];
  let totalSupply = 0;
  let price = 0;

  while (totalSupply <= cap) {
    data.push({
      totalSupply,
      price,
    });

    totalSupply += increment;
    if (type === CurveTypes.linear && slope && intercept) {
      price = slope * totalSupply + intercept;
    } else {
      price = 0;
    }
  }

  const strokeColors = {
    grey: "#808080",
    white: "#ffffff",
    green: "#6bd28e",
    lemon: "#f3f264",
  };

  return (
    <div>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="fillGradient" x1="0" y1="-1" x2="0" y2="1">
            <stop offset="5%" stopColor="#3182ce" stopOpacity={1} />
            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="totalSupply"
          tick={{ fill: previewOnly ? strokeColors.grey : strokeColors.white }}
          axisLine={{
            stroke: previewOnly ? strokeColors.grey : strokeColors.white,
          }}
        />
        <YAxis
          dataKey="price"
          tick={{ fill: previewOnly ? strokeColors.grey : strokeColors.white }}
          axisLine={{
            stroke: previewOnly ? strokeColors.grey : strokeColors.white,
          }}
        />
        <Tooltip
          labelStyle={{ color: "#2f3ece" }}
          itemStyle={{ color: "#2f3ece" }}
          formatter={function (value, name) {
            return `${value}`;
          }}
          labelFormatter={function (value) {
            return `Total Supply: ${value}`;
          }}
        />
        {legend ? <Legend /> : <></>}
        <Line
          type="monotone"
          dataKey="price"
          stroke={previewOnly ? strokeColors.green : strokeColors.lemon}
          activeDot={{ r: 5 }}
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#fillGradient)"
          data
        />
      </LineChart>
    </div>
  );
};

export default Graph;
