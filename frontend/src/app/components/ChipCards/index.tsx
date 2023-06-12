import "./index.scss";

type Cardprops = {
  title: string;
  value: string;
};

const ChipCard = (props: Cardprops) => {
  const { title, value } = props;
  return (
    <div className="chip-card">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
    </div>
  );
};

export default ChipCard;
