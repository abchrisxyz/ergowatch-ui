import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import BreadCrumbs from "../../components/breadcrumbs";
import { API_ROOT } from "../../config";

import './metrics.css';


const Metrics = () => {

  const [addresses, setAddresses] = useState(undefined);
  const [contracts, setContracts] = useState(undefined);
  const [top100Prc, setTop100Prc] = useState(undefined);
  const [tvlPrc, setTVLPrc] = useState(undefined);
  const [cexs, setCexs] = useState(undefined);
  const [transferVolume, setTransferVolume] = useState(undefined);
  const [transactions, setTransactions] = useState(undefined);
  const [meanAge, setMeanAge] = useState(undefined);
  const [boxes, setBoxes] = useState(undefined);

  useEffect(() => {
    const qry = API_ROOT + "/metrics/preview";
    fetch(qry)
      .then(res => res.json())
      .then(res => {
        setAddresses(Number(res.total_addresses));
        setContracts(Number(res.total_contracts));
        setTop100Prc(Number(res.top100_supply_fraction * 100.));
        setTVLPrc(Number(res.contracts_supply_fraction * 100.));
        setCexs(Number(res.cexs_supply / 10 ** 9));
        setMeanAge(Number(res.mean_age_days));
        setTransferVolume(Number(res.transferred_value_24h) / 10 ** 9);
        setTransactions(Number(res.transactions_24h));
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
        <Link to="/metrics/contracts">
          <div className="preview">
            <h2>Contracts</h2>
            <div className="item">
              Total: {contracts ? contracts.toLocaleString('en') : '...'}
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
        <Link to="/metrics/tvl">
          <div className="preview">
            <h2>TVL</h2>
            <div className="item">
              Supply in contracts: {tvlPrc ? tvlPrc.toFixed(2) : '...'}%
            </div>
          </div>
        </Link>
        <Link to="/metrics/cexs">
          <div className="preview">
            <h2>Exchanges</h2>
            <div className="item">
              On CEX's: {cexs ? Number(cexs.toFixed(0)).toLocaleString('en') : '...'} ERG
            </div>
          </div>
        </Link>
        <Link to="/metrics/age">
          <div className="preview">
            <h2>Supply Age</h2>
            <div className="item">
              Mean: {meanAge ? Number(meanAge.toFixed(1)).toLocaleString('en') : '...'} days
            </div>
          </div>
        </Link>
        <Link to="/metrics/transfer-volume">
          <div className="preview">
            <h2>Transfer Volume</h2>
            <div className="item">
              Last 24h: {transferVolume ? Number(transferVolume.toFixed(0)).toLocaleString('en') : '...'} ERG
            </div>
          </div>
        </Link>
        <Link to="/metrics/transactions">
          <div className="preview">
            <h2>Transactions</h2>
            <div className="item">
              Last 24h: {transactions ? Number(transactions.toFixed(1)).toLocaleString('en') : '...'}
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