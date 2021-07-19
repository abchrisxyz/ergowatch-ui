import { Link } from "react-router-dom";

import BreadCrumbs from "../components/breadcrumbs";

import './oracle-pools.css';

const OraclePoolPreview = ({ pair, label }) => {
  return (

    <Link to={"oracle-pools/" + pair}>
      <div className="oracle-pool-preview">
        {label}
      </div>
    </Link>

  );
}

const OraclePools = () => {
  return (
    <main>
      <h1>Oracle Pools</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/oracle-pools">Oracle Pools</Link>
      </BreadCrumbs>
      <div className="oracle-pools">
        <OraclePoolPreview pair="ERGUSD" label="ERG/USD" />
      </div>
    </main>
  )
}

export default OraclePools;