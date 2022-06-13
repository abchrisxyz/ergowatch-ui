import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  useLocation
} from 'react-router-dom';

import Home from './pages/home';
import Emission from './pages/emission';
import Metrics from './pages/metrics';
import Age from './pages/metrics/age';
import Addresses from './pages/metrics/addresses';
import Contracts from './pages/metrics/contracts';
import Distribution from './pages/metrics/distribution';
import TVL from './pages/metrics/tvl';
import Cexs from './pages/metrics/cexs';
import TransferVolume from './pages/metrics/transfer-volume';
import Transactions from './pages/metrics/transactions';
import UTXOs from './pages/metrics/utxos';
import OraclePools from './pages/oracle-pools';
import OraclePool from './pages/oracle-pool';
import SigmaUSD from './pages/sigmausd';
import API from './pages/api';
import { API_ROOT } from './config';


import './App.css';


const SyncStatus = () => {
  const [nodeHeight, setNodeHeight] = useState("...")
  const [syncHeight, setSyncHeight] = useState("...")

  const location = useLocation();

  useEffect(() => {
    const qry = API_ROOT + "/height";
    fetch(qry)
      .then(res => res.json())
      .then(res => setNodeHeight(res))
      .catch(err => console.error(err));
  }, [location]);

  useEffect(() => {
    const qry = API_ROOT + "/sync-height";
    fetch(qry)
      .then(res => res.json())
      .then(res => setSyncHeight(res))
      .catch(err => console.error(err));
  }, [location]);

  return (
    <div id="sync-status">
      <div>
        <div>DB height</div>
        <div className="value">{syncHeight}</div>
      </div>
      <div>
        <div>Node height</div>
        <div className="value">{nodeHeight}</div>
      </div>
    </div>
  );
}


const MatchLocation = ({ location, children }) => {
  return useLocation().pathname.startsWith(location) ? children : null;
}

function App() {
  const [showNav, setShowNav] = useState(false);

  const hideNav = () => {
    if (showNav) setShowNav(false);
  }

  return (
    <Router>
      <div className="App">
        <div className={showNav ? "wrapper toggled" : "wrapper"}>
          <header>
            <div className="logo">
              <a href="/">Ergo Watch</a>
            </div>
            <button id="nav-burger" onClick={() => setShowNav(!showNav)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
              </svg>
            </button>
          </header>
          <nav>
            <div className="flex-col">
              <NavLink onClick={() => hideNav()} exact to="/emission">Emission</NavLink>
              <NavLink onClick={() => hideNav()} exact to="/metrics">Metrics</NavLink>
              <MatchLocation location="/metrics">
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/addresses">Addresses</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/contracts">Contracts</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/distribution">Distribution</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/tvl">TVL</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/cexs">Exchanges</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/age">Supply Age</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/transfer-volume">Transfer Volume</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/transactions">Transactions</NavLink>
                <NavLink onClick={() => hideNav()} exact className="sub-navlink" to="/metrics/utxos">UTXO's</NavLink>
              </MatchLocation>
              <NavLink onClick={() => hideNav()} exact to="/oracle-pools">Oracle Pools</NavLink>
              <NavLink onClick={() => hideNav()} exact to="/sigmausd">SigmaUSD</NavLink>
            </div>
          </nav>
          <SyncStatus />
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/apis" exact>
              <API />
            </Route>
            <Route path="/metrics" exact>
              <Metrics />
            </Route>
            <Route path="/metrics/addresses">
              <Addresses />
            </Route>
            <Route path="/metrics/age">
              <Age />
            </Route>
            <Route path="/metrics/cexs">
              <Cexs />
            </Route>
            <Route path="/metrics/contracts">
              <Contracts />
            </Route>
            <Route path="/metrics/distribution">
              <Distribution />
            </Route>
            <Route path="/metrics/TVL">
              <TVL />
            </Route>
            <Route path="/metrics/transfer-volume">
              <TransferVolume />
            </Route>
            <Route path="/metrics/transactions">
              <Transactions />
            </Route>
            <Route path="/metrics/utxos">
              <UTXOs />
            </Route>
            <Route path="/emission">
              <Emission />
            </Route>
            <Route exact path="/oracle-pools">
              <OraclePools />
            </Route>
            <Route path="/oracle-pools/:pair">
              <OraclePool />
            </Route>
            <Route path="/sigmausd">
              <SigmaUSD />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
