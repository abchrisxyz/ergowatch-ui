import Metric from "../../components/metric";

import './pool-status.css';

export function oracleStatus(lastCommit) {
  const hoursSinceLastCommit = (Date.now() - Date.parse(lastCommit)) / 1000 / 3600;
  var status = 'offline';
  if (hoursSinceLastCommit <= 1) {
    status = 'active'
  }
  else if (hoursSinceLastCommit <= 24) {
    status = 'idle'
  }
  return status
}

const Summary = ({ data, k, label }) => {
  const nTotal = data.length;
  const status = data.map(row => oracleStatus(row["last_commit"]))
  const nActive = status.filter(s => s === "active").length
  const nIdle = status.filter(s => s === "idle").length
  const nOffline = status.filter(s => s === "offline").length

  const fActive = nActive / nTotal * 100;
  const fIdle = nIdle / nTotal * 100;

  const c = "18";
  const viewBox = "0 0 36 36";

  return (
    <div className="summary">
      <svg width="100%" height="100%" viewBox={viewBox} className="donut">
        {/* <circle className="donut-hole" cx={c} cy={c} r="15.91549430918954" fill="#fff"></circle> */}
        <circle className="donut-ring" cx={c} cy={c} r="15.91549430918954" fill="transparent" stroke="#d2d3d4" strokeWidth="3"></circle>
        <circle className="donut-segment" cx={c} cy={c} r="15.91549430918954" fill="transparent" stroke="rgb(74, 199, 109)" strokeWidth="3" strokeDasharray={`${fActive} ${100 - fActive}`} strokeDashoffset="25"></circle>
        <circle className="donut-segment" cx={c} cy={c} r="15.91549430918954" fill="transparent" stroke="orange" strokeWidth="3" strokeDasharray={`${fIdle} ${100 - fIdle}`} strokeDashoffset={25 - fActive}></circle>
        <text x="50%" y="50%" className="donut-text">
          {nActive + nIdle} / {nTotal}
        </text>
      </svg>
      <div>
        <div className="active">
          <Metric name="Active" value={nActive} />
        </div>
        <div className="idle">
          <Metric name="Idle" value={nIdle} />
        </div>
        <div className="offline">
          <Metric name="Offline" value={nOffline} />
        </div>
      </div>
    </div >
  );
}


const PoolStatus = ({ oracleStats }) => {
  if (!oracleStats) return "";

  return (
    <div className="pool-status">
      <Summary data={oracleStats} />
    </div>
  );
}

export default PoolStatus;