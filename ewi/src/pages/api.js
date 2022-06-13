import BreadCrumbs from "../components/breadcrumbs";
import { Link } from "react-router-dom";

import './api.css'

const API = () => {
  return (
    <main>
      <h1>API</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/apis">API</Link>
      </BreadCrumbs>
      <div className="api">
        <p>
          This API is built on top of a new backend under active development.
          The data currently shown on ergo.watch uses an older backend and API but will
          migrate to this API once enough features are supported.
        </p>
        <h2 style={{ marginTop: "2em" }}>
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
            Feel free to get in touch if you need help or want to discuss other arrangements.
          </p>
        </div>
        <h2 style={{ marginTop: "2em" }}>
          Documentation
        </h2>
        <div>
          <p>
            Documentation is available in Swagger or Redoc format:
          </p>
          <div className="buttons">
            <a href="https://ergo.watch/api/v0/docs">
              <div className="button">
                Swagger
              </div>
            </a>
            <a href="https://ergo.watch/api/v0/redoc">
              <div className="button">
                Redoc
              </div>
            </a>
          </div>
        </div>
      </div>
    </main >
  );
}

export default API;
