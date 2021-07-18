import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

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
      <Metric name="Nb. of datapoints" value="6" />
    </div>
  );
}

const OraclePool = () => {
  const { pair } = useParams();
  const [stats, setStats] = useState(undefined);
  const [latest, setLatest] = useState(undefined);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/oracle-pools/ergusd/latest";
    fetch(qry)
      .then(res => res.json())
      .then(res => setLatest(res))
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
        <Card title="Latest">
          <Latest data={latest} />
        </Card>
        <Card title="Oracles">
          <PoolStatus oracleStats={stats} />
        </Card>
      </div>
      <Card title="Oracle stats">
        <OracleStats data={stats} />
      </Card>
    </main>
  )
}

export default OraclePool;