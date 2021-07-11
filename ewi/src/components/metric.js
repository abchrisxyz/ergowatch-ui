import './metric.css';

const Metric = ({ name, prefix, value, units }) => {
  return (
    <div className="metric">
      <div className="metric-name">{name}</div>
      <div className="metric-contents">
        {prefix ? <div className="metric-prefix">{prefix}</div> : ""}
        <div className="metric-value">{value}</div>
        {units ? <div className="metric-units">{prefix}</div> : ""}
      </div>
    </div>
  );
}

export default Metric;