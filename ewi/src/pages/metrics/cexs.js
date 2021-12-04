import { useState, useEffect } from "react";

import { AddressLink } from "../../components/links";
import Card from "../../components/card";
import colors from "../../config/colors";
import SeriesChart from "./common/series-chart";
import MetricTemplate from "./common/template";
import ChangeSummary from "./common/change-summary";
import { API_ROOT } from "../../config";

import "./cexs.css";

const seriesOptions = [
  { label: "All", value: "total", index: 0, color: colors.orange },
  { label: "Coinex", value: "coinex", index: 1, color: colors.green },
  { label: "Gate.io", value: "gateio", index: 2, color: colors.pink },
  { label: "Kucoin", value: "kucoin", index: 3, color: colors.blue },
];

const Cexs = () => {
  const id = "cexs";

  const [relative, setRelative] = useState(true);

  return (
    <MetricTemplate id={id} name="Exchanges">
      <Card>
        <SeriesChart
          api="/metrics/cexs/series"
          seriesOptions={seriesOptions}
          initialOptions={[0,]}
          yLabel={relative ? "% of Circ. Supply" : "ERG"}
          ySize={relative ? 60 : 80}
          setRelative={setRelative}
          relative={relative}
          relativeTo="circulating_supply"
          toFixed={relative ? 2 : 0}
          units={relative ? "%" : ""}
        />
      </Card>
      <Card title="Description">
        <p>ERG supply on <b>known</b>, <b>main</b> exchange addresses.</p>
        <p>
          Significant jumps are likely the result of untracked exchange addresses and do not necessarily represent actual flow to/from exchanges.<br />
          Data subject to change as more CEX addresses get tracked.
        </p>
        <p>Updates every 24h.</p>
      </Card>
      <Card title="Change Summary">
        <ChangeSummary
          id={id}
          headers={["", "Last", "1 Day", "1 Week", "4 Weeks", "6 Months ", "1 Year"]}
          fields={["latest", "diff_1d", "diff_1w", "diff_4w", "diff_6m", "diff_1y"]}
          keys={["total", "coinex", "gateio", "kucoin"].map(f => relative ? f + "_rel" : f)}
          labels={{
            total: "All exchanges",
            coinex: "Coinex",
            gateio: "Gate.io",
            kucoin: "Kucoin",

            total_rel: "All exchanges",
            coinex_rel: "Coinex",
            gateio_rel: "Gate.io",
            kucoin_rel: "Kucoin",
          }}
          toFixed={relative ? 2 : 0}
          units={relative ? "%" : ""}
        />
      </Card>
      <Card title="Known Addresses">
        <ExchangeAddresses />
      </Card>
    </MetricTemplate>
  )
}

const cexLogos = {
  coinex: 'https://www.coinex.com/favicon.ico',
  gate: 'https://www.gate.io/favicon.ico',
  kucoin: 'https://assets.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png',
};

const cexNames = {
  coinex: 'Coinex',
  gate: 'Gate.io',
  kucoin: 'Kucoin',
};


const ExchangeAddresses = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const qry = API_ROOT + "/metrics/cexs/list";
    fetch(qry)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="cex-list">
      <div className="rows">
        <div className="header">
          <div>Exchange</div>
          <div>Address</div>
          <div className="right">Balance*</div>
        </div>
        {data.map((r, i) => <div key={i}>
          <div className="cex"><img src={cexLogos[r.cex]} alt="logo" />{cexNames[r.cex]}</div>
          <AddressLink address={r.address}><span>{r.address.substring(0, 8)}</span></AddressLink>
          <div className="right">{Number((r.balance).toFixed(0)).toLocaleString('en')} ERG</div>
        </div>
        )}
      </div>
      <div className="info">* Balances as of last snapshot (around 12am UTC)</div>
    </div>
  );
}


export default Cexs;
