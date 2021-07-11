import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import BreadCrumbs from "../components/breadcrumbs";
import Card from "../components/card";
import Metric from "../components/metric";

import './oracle-pool.css';


function oracleStatus(lastCommit) {
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

const Status = ({ lastCommit }) => {
  const status = oracleStatus(lastCommit)

  return (
    <div className={"status " + status}>
      {status}
    </div>
  );
}

function formatCommitDate(timeString) {
  const d = new Date(timeString)
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

function formatRow(row, idx) {

  const acceptanceRate = row.commits > 0
    ? (row.accepted_commits / row.commits * 100).toFixed(1) + "%"
    : "-";

  return [
    <div key={"or-" + idx} className="address"><span className="header">Oracle:</span>{row.address.substring(0, 8)}</div>,
    <div key={"cs-" + idx} className="stats"><span className="header">Commits:</span>{row.commits}</div>,
    <div key={"ac-" + idx} className="stats"><span className="header">Accepted:</span>{acceptanceRate}</div>,
    <div key={"lc-" + idx} className="stats"><span className="header">Last:</span>{formatCommitDate(row.last_commit)}</div>,
  ];
}

function reduceData(acc, row, idx) {
  acc.push(...formatRow(row, idx));
  return acc;
}


const CommitStats = ({ data }) => {
  if (!data) return "";

  return (
    <div className="commit-stats">
      {data.reduce(reduceData, [])}
    </div>
  );
}


const OracleStatus = ({ data }) => {
  if (!data) return "";

  const nTotal = data.length;
  const status = data.map(row => oracleStatus(row.last_commit))
  const nActive = status.filter(s => s === "active").length
  const nIdle = status.filter(s => s === "idle").length
  const nOffline = status.filter(s => s === "offline").length

  const fActive = nActive / nTotal * 100;
  const fIdle = nIdle / nTotal * 100;

  const c = "18";
  const viewBox = "0 0 36 36";

  return (
    <div className="oracle-status">
      <svg width="100%" height="100%" viewBox={viewBox} className="donut">
        <circle className="donut-hole" cx={c} cy={c} r="15.91549430918954" fill="#fff"></circle>
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

const OraclePool = () => {
  const { pair } = useParams();
  const [stats, setStats] = useState(undefined)

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/oracle-pools/commit-stats/ergusd";
    fetch(qry)
      .then(res => res.json())
      .then(res => setStats(res))
      .catch(err => console.error(err));
  }, [])

  return (
    <main>
      <h1>{pair} Oracle Pool</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/oracle-pools">Oracle Pools</Link>
        <Link to="/oracle-pools/{pair}">{pair}</Link>
      </BreadCrumbs>
      <div className="oracle-pool-wrapper">
        <Card title="Latest">
          <Metric name="Rate" value="$6.73" />
          <Metric name="Nb. of datapoints" value="6" />
        </Card>
        <Card title="Oracles">
          <OracleStatus data={stats} />
        </Card>
        <Card title="Oracle payouts">
          <CommitStats data={stats} />
        </Card>
        <Card title="Collector stats">
          ...
        </Card>
      </div>
    </main>
  )
}

export default OraclePool;