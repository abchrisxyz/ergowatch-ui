import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import BreadCrumbs from "../../../components/breadcrumbs";
import Card from "../../../components/card";

import './age.css';

const AgeChart = ({ window }) => {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    setData(undefined);
  }, [window])

  return (
    <div className="age-chart">
    </div>
  );
}

const Age = () => {
  const [window, setWindow] = useState('30d');

  return (
    <main>
      <h1>Supply Age</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/metrics">Metrics</Link>
        <Link to="/metrics/age">Supply Age</Link>
      </BreadCrumbs>
      <div className="metrics">
        <Card title="Latest">

        </Card>
      </div>
      <Card title="Chart">
        <div className="history">
          <ul className="window-selector">
            <li className={window === '3m' ? 'active' : null} onClick={() => setWindow('3m')}>3m</li>
            <li className={window === '6m' ? 'active' : null} onClick={() => setWindow('6m')}>6m</li>
            <li className={window === '1y' ? 'active' : null} onClick={() => setWindow('1y')}>1y</li>
            <li className={window === 'all' ? 'active' : null} onClick={() => setWindow('all')}>all</li>
          </ul>
          <AgeChart window={window} />
        </div>
      </Card>
      <Card title="Description">
        <p>Mean supply age represents the average time since last change of address accross all circulating supply.</p>
        <p>Transfer volume is the amount of ERG transfered between different addresses, excluding coinbase emission.</p>
        <p>Updates every 24h.</p>
      </Card>
    </main>
  )
}

export default Age;