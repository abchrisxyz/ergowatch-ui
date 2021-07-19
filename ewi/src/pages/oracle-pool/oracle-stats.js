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

  return (
    <li>
      <div className="header">
        <h3>
          Oracle {data.oracle_id}
        </h3>
        <a href={`https://explorer.ergoplatform.com/en/addresses/${data.address}`} target="_blank" rel="noopener noreferrer">{data.address.substring(0, 8)}</a>
      </div>

      <div className="stats">
        <div className="commits">
          <h4>Datapoints</h4>
          <div className="row">
            <span>Submitted</span>{data.commits}
          </div>
          <div className="row">
            <span>Accepted</span>{acceptanceRate}
          </div>
          <div className="row">
            <span>Last</span>{formatCommitDate(data.last_commit)}
          </div>

          <div className="collections">
            <h4>Collections</h4>
            <div className="row">
              <span>Payouts</span>{data.collections}
            </div>
            <div className="row">
              <span>Last</span>{formatCommitDate(data.last_collection)}
            </div>
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