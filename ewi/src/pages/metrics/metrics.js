import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import BreadCrumbs from "../../components/breadcrumbs";
import { API_ROOT } from "../../config";

import './metrics.css';


const Metrics = () => {

  const [addresses, setAddresses] = useState(undefined);
  const [top100Prc, setTop100Prc] = useState(undefined);
  const [meanAge, setMeanAge] = useState(undefined);
  const [boxes, setBoxes] = useState(undefined);

  useEffect(() => {
    const qry = API_ROOT + "/metrics/preview";
    fetch(qry)
      .then(res => res.json())
      .then(res => {
        setAddresses(Number(res.total_addresses));
        setTop100Prc(Number(res.top100_supply_fraction * 100.));
        setMeanAge(Number(res.mean_age));
        setBoxes(Number(res.utxos));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main>
      <h1>On-Chain Metrics</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/metrics">Metrics</Link>
      </BreadCrumbs>
      <div className="on-chain-metrics">
        <Link to="/metrics/addresses">
          <div className="preview">
            <h2>Addresses</h2>
            <div className="item">
              Total: {addresses ? addresses.toLocaleString('en') : '...'}
            </div>
          </div>
        </Link>
        <Link to="/metrics/distribution">
          <div className="preview">
            <h2>Distribution</h2>
            <div className="item">
              Supply in top 100: {top100Prc ? top100Prc.toFixed(2) : '...'}%
            </div>
          </div>
        </Link>
        <Link to="/metrics/age">
          <div className="preview">
            <h2>Supply Age</h2>
            <div className="item">
              Mean age: {meanAge ? Number(meanAge.toFixed(1)).toLocaleString('en') : '...'} days
            </div>
          </div>
        </Link>
        <Link to="/metrics/utxos">
          <div className="preview">
            <h2>UTXO's</h2>
            <div className="item">
              Total: {boxes ? boxes.toLocaleString('en') : '...'}
            </div>
          </div>
        </Link>
      </div>
    </main>
  )
}

export default Metrics;