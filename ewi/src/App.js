import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
} from 'react-router-dom';

import Home from './pages/home';
import Emission from './pages/emission';
import OraclePools from './pages/oracle-pools';
import OraclePool from './pages/oracle-pool';
import SigmaUSD from './pages/sigmausd';


import './App.css';


const SyncStatus = () => {
  const [nodeHeight, setNodeHeight] = useState("...")
  const [syncHeight, setSyncHeight] = useState("...")

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/height";
    fetch(qry)
      .then(res => res.json())
      .then(res => setNodeHeight(res))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/sync-height";
    fetch(qry)
      .then(res => res.json())
      .then(res => setSyncHeight(res))
      .catch(err => console.error(err));
  }, []);

  return (
    <div id="sync-status">
      <div>Sync height: {syncHeight}</div>
      <div>/</div>
      <div>Node height: {nodeHeight}</div>
    </div>
  );
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
              <a href="/">ErgoWatch</a>
              <button id="nav-burger" onClick={() => setShowNav(!showNav)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>
            </div>
          </header>
          <nav>
            <div className="flex-col">
              <NavLink onClick={() => hideNav()} exact to="/emission">Emission</NavLink>
              <NavLink onClick={() => hideNav()} exact to="/oracle-pools">Oracle Pools</NavLink>
              <NavLink onClick={() => hideNav()} exact to="/sigmausd">SigmaUSD</NavLink>
            </div>
          </nav>
          <Switch>
            <Route path="/" exact>
              <Home />
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
          <footer>
            <SyncStatus />
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
