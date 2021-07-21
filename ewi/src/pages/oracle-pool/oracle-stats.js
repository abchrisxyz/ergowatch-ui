import { oracleStatus } from './pool-status';
import './oracle-stats.css';

function formatCommitDate(timeString) {
  if (!timeString) return "-";
  const d = new Date(timeString)
  const f = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' });
  return f.format(d);
}

const Oracle = ({ data, idx }) => {
  const acceptanceRate = data.commits > 0
    ? (data.accepted_commits / data.commits * 100).toFixed(1) + "%"
    : "-";

  const status = oracleStatus(data.last_commit);

  return (
    <li>
      <div className="header">
        <h3>
          <svg className={"status " + status} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" height="0.8em" width="0.8em">
            <circle cx="50" cy="50" r="50" />
          </svg>
          Oracle {data.oracle_id}
        </h3>
        <div className="address">
          <a href={`https://explorer.ergoplatform.com/en/addresses/${data.address}`} target="_blank" rel="noopener noreferrer">{data.address.substring(0, 8)}</a>
          {/* <div className={"status " + status}></div> */}
        </div>
      </div>

      <div className="stats">
        <div className="commits">
          <h4>Datapoints</h4>
          <div className="row">
            Submitted<span>{data.commits}</span>
          </div>
          <div className="row">
            Accepted<span>{acceptanceRate}</span>
          </div>
          <div className="row">
            Last<span>{formatCommitDate(data.last_commit)}</span>
          </div>
        </div>
        <div className="collections">
          <h4>Collections</h4>
          <div className="row">
            Payouts<span>{data.collections}</span>
          </div>
          <div className="row">
            Last<span>{formatCommitDate(data.last_collection)}</span>
          </div>
        </div>
      </div>

    </li>
  );
}

const OracleStats = ({ data }) => {
  if (!data) return "";

  return (
    <div className="oracles-stats">
      <ol>
        {data.map((row, idx) => <Oracle data={row} key={idx} />)}
      </ol>
    </div>
  );
}

export default OracleStats;