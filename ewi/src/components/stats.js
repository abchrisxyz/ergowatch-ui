import './stats.css';

export const Stat = ({ label, value }) => {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}

export const StatGroup = ({ children }) => {
  return (
    <div className="stats-group">
      {children}
    </div>
  );
}
