import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";

import BreadCrumbs from "../../components/breadcrumbs";
import Card from "../../components/card";
import PoolStatus from "./pool-status";
import OracleStats from "./oracle-stats";
import { API_ROOT } from "../../config";

import './oracle-pool.css';


const PoolDetails = ({ data }) => {
  return (
    <div className="stats-group">
      <div className="stat">
        <div className="label">Number of oracles</div>
        <div className="value">11</div>
      </div>
      <div className="stat">
        <div className="label">Consensus number</div>
        <div className="value">4</div>
      </div>
      <div className="stat">
        <div className="label">Deviation range</div>
        <div className="value">5 %</div>
      </div>
      <div className="stat">
        <div className="label">Live epoch length</div>
        <div className="value">6 blocks</div>
      </div>
      <div className="stat">
        <div className="label">Epoch prep length</div>
        <div className="value">2 blocks</div>
      </div>
    </div>
  );
}

const Latest = ({ data }) => {
  if (data === undefined) return "";
  return (
    <div className="stats-group">
      <div className="stat">
        <div className="label">Rate</div>
        <div className="value">{"$" + Number(data.price).toFixed(2)}</div>
      </div>
      <div className="stat">
        <div className="label">Posting height</div>
        <div className="value">{data.height}</div>
      </div>
      <div className="stat">
        <div className="label">Datapoints</div>
        <div className="value">{data.datapoints}</div>
      </div>
    </div>
  );
}

const Epochs = ({ data }) => {
  if (data.length === 0) return "";
  return (
    <div>
      <ResponsiveContainer width="99%" height={250}>
        <LineChart data={data} margin={{ top: 1, left: -25, right: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="n" dot={{ r: 1 }} strokeWidth={1} isAnimationActive={false} />
          <CartesianGrid stroke="#ccc" strokeDasharray="2 2" vertical={false} />
          <XAxis dataKey="h" interval="preserveStartEnd" tickMargin={10} />
          <YAxis tickMargin={10} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const OraclePool = () => {
  const { pair } = useParams();
  const [stats, setStats] = useState(undefined);
  const [latest, setLatest] = useState(undefined);
  const [epochs, setEpochs] = useState([]);

  useEffect(() => {
    const qry = API_ROOT + "/oracle-pools/ergusd/latest";
    fetch(qry)
      .then(res => res.json())
      .then(res => setLatest(res))
      .catch(err => console.error(err));
  }, [])

  useEffect(() => {
    const qry = API_ROOT + "/oracle-pools/ergusd/recent-epoch-durations";
    fetch(qry)
      .then(res => res.json())
      .then(res => setEpochs(res))
      .catch(err => console.error(err));
  }, [])

  useEffect(() => {
    const qry = API_ROOT + "/oracle-pools/ergusd/oracle-stats";
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
      <div className="oracle-pool">
        <div className="oracle-pool-group">
          <Card title="Pool Settings">
            <PoolDetails />
          </Card>
          <Card title="Latest Price">
            <Latest data={latest} />
          </Card>
          <Card title="Active Oracles">
            <PoolStatus oracleStats={stats} />
          </Card>
        </div>
        <Card title="Nb. Of Blocks Between Updates">
          <Epochs data={epochs} />
        </Card>
        <Card title="Oracle Stats">
          <OracleStats data={stats} />
        </Card>
      </div>
    </main>
  )
}

export default OraclePool;