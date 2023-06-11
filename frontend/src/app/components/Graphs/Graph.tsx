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

  //TODO: Add upperbounds to reference area
  // const maxLineValue = Math.max(...data.map((entry: any) => entry.price));
  // const referenceAreaUpperBound = maxLineValue;

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
        {!previewOnly ? (
          <ReferenceArea x1={40} x2={60} color={strokeColors.lemon} />
        ) : (
          <></>
        )}

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
      </LineChart>
    </div>
  );
};

export default Graph;
