import { Link } from "react-router-dom";

import BreadCrumbs from "../../../components/breadcrumbs";

const MetricTemplate = ({ id, name, children }) => {
  return (
    <main>
      <h1>{name}</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/metrics">Metrics</Link>
        <Link to={`/metrics/${id}`}>{name}</Link>
      </BreadCrumbs>
      {children}
    </main>
  )
}

export default MetricTemplate;
