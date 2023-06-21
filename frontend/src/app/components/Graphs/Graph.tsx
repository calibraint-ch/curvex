import { CurveTypes, GraphProps, dataType, strokeColors } from "./constants";
import "./index.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";

const Graph = (props: GraphProps) => {
  const {
    cap,
    increment,
    slope,
    intercept,
    type,
    legend = false,
    previewOnly,
    a,
    n,
    c1,
    c2,
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
    } else if (type === CurveTypes.polynomial && a && n) {
      price = Math.pow(a * totalSupply, n);
    } else if (type === CurveTypes.subLinear && n) {
      price = Math.pow(totalSupply, n);
    } else if (type === CurveTypes.sCurve && c1 && c2) {
      price = 1 / Math.exp(-c1 * (totalSupply - c2));
    } else {
      price = 0;
    }
  }

  const x1 = 40;
  const x2 = 60;

  const startDataPoint = data.find((entry) => entry.totalSupply === x1);
  const endDataPoint = data.find((entry) => entry.totalSupply === x2);
  const startYValue = startDataPoint ? startDataPoint.price : null;
  const endYValue = endDataPoint ? endDataPoint.price : null;

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
          data
        />
        {!previewOnly && startYValue && endYValue && (
          <ReferenceArea
            x1={x1}
            x2={x2}
            y1={0}
            y2={Math.max(startYValue, endYValue)}
            fill={strokeColors.lemon}
            fillOpacity={0.5}
          />
        )}
      </LineChart>
    </div>
  );
};

export default Graph;
