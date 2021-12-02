import { useState, useEffect } from "react";

import { AddressLink } from "../../components/links";
import Card from "../../components/card";
import colors from "../../config/colors";
import SeriesChart from "./common/series-chart";
import MetricTemplate from "./common/template";
import ChangeSummary from "./common/change-summary";
import { API_ROOT } from "../../config";

import "./utxos.css";

const seriesOptions = [
  { label: "Total", value: "boxes", index: 0, color: colors.orange },
];


const DustyList = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const qry = API_ROOT + "/metrics/utxos/list";
    fetch(qry)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dusty-list">
      <div className="header">
        <div>#</div>
        <div>Address</div>
        <div className="right">Boxes</div>
      </div>
      {data.map((r, i) => <div key={i}>
        {i + 1}
        <AddressLink address={r.address}><span>{r.address.substring(0, 8)}</span></AddressLink>
        <div className="right">{Number(r.boxes).toLocaleString('en')}</div>
      </div>
      )}
    </div>
  );
}


const UTXOs = () => {
  const id = "utxos";
  return (
    <MetricTemplate id={id} name="UTXO's">
      <Card>
        <SeriesChart
          id={id}
          api="/metrics/utxos/series"
          seriesOptions={seriesOptions}
          initialOptions={[0,]}
          yLabel="Boxes"
          ySize={80}
        />
      </Card>
      <Card title="Description">
        <p>Total number of unspent boxes.</p>
      </Card>
      <Card title="Change Summary">
        <ChangeSummary
          id={id}
          headers={["", "Current", "1 Day", "1 Week", "4 Weeks", "6 Months ", "1 Year"]}
          fields={["latest", "diff_1d", "diff_1w", "diff_4w", "diff_6m", "diff_1y"]}
          keys={[
            "boxes",
          ]}
          labels={{
            boxes: "Boxes",
          }}
        />
      </Card>
      <Card title='"Dusty" List'>
        <DustyList />
      </Card>
    </MetricTemplate>
  )
}

export default UTXOs;
