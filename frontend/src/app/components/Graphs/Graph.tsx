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
  const { cap, increment, slope, intercept, type, legend = false } = props;
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
        <XAxis dataKey="totalSupply" />
        <YAxis dataKey="price" />
        <Tooltip />
        {legend ? <Legend /> : <></>}
        <Line
          type="monotone"
          dataKey="price"
          stroke="#6BD28E"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default Graph;
