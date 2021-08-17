import ReactTooltip from 'react-tooltip';
import './stats.css';

export const Stat = ({ label, value, tip }) => {
  return (
    <div className="stat" data-tip={tip ? tip : null}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {tip ? <ReactTooltip place="top" type="dark" effect="float" multiline={true} /> : ""}
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
