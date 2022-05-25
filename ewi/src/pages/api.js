import BreadCrumbs from "../components/breadcrumbs";
import { Link } from "react-router-dom";

import './api.css'

const API = () => {
  return (
    <main>
      <h1>API</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/api">API</Link>
      </BreadCrumbs>
      <div className="api">
        <h2>
          Terms of service
        </h2>
        <div>
          <p>
            You can use this API service in your apps and clients if you disclose to your users that you use this service and link to <a href="https://ergo.watch">https://ergo.watch</a>.
          </p>
          <p>
            If foreseeing heavy usage, consider running your own instance. See github for instructions.
          </p>
          <p>
            Feel to get in touch if you need help or want to discuss other arrangements.
          </p>
        </div>
        <h2 style={{ marginTop: "2em" }}>
          Documentation
        </h2>
        <div>
          <p>
            <b>Note:</b><br />
            This API is built on top of a new backend under active development.
            The website uses an older backend and API. It will be upgraded once the
            new backend supports enough features to replace the current one.
          </p>
          <div>
            <button href="https://ergo.watch/api/v0/docs">Swagger</a>
            <a href="https://ergo.watch/api/v0/redoc">Redoc</a>
          </div>
        </div>
      </div>
    </main >
  );
}

export default API;
