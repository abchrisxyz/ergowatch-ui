import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";

import BreadCrumbs from "../../components/breadcrumbs";
import Card from "../../components/card";
import Metric from "../../components/metric";
import PoolStatus from "./pool-status";
import OracleStats from "./oracle-stats";

import './oracle-pool.css';

const Latest = ({ data }) => {
  if (data === undefined) return "";
  return (
    <div className="latest">
      <Metric name="Rate" value={"$" + Number(data.price).toFixed(2)} />
      <Metric name="Posting height" value={data.height} />
      <Metric name="Nb. of datapoints" value={data.datapoints} />
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
          <XAxis dataKey="h" reversed={true} interval="preserveStart" tickMargin={10} />
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
    const qry = "http://192.168.1.72:8000/oracle-pools/ergusd/latest";
    fetch(qry)
      .then(res => res.json())
      .then(res => setLatest(res))
      .catch(err => console.error(err));
  }, [])

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/oracle-pools/ergusd/recent-epoch-durations";
    fetch(qry)
      .then(res => res.json())
      .then(res => setEpochs(res))
      .catch(err => console.error(err));
  }, [])

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/oracle-pools/ergusd/oracle-stats";
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
          <Card title="Latest">
            <Latest data={latest} />
          </Card>
          <Card title="Oracles">
            <PoolStatus oracleStats={stats} />
          </Card>
        </div>
        <Card title="Recent epoch durations">
          <Epochs data={epochs} />
        </Card>
        <Card title="Oracle stats">
          <OracleStats data={stats} />
        </Card>
      </div>
    </main>
  )
}

export default OraclePool;