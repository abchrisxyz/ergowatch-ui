import Card from "../../components/card";
import colors from "../../config/colors";
import SeriesChart from "./common/series-chart";
import MetricTemplate from "./common/template";
import ChangeSummary from "./common/change-summary";

import './addresses-chart.css';

const seriesOptions = [
  { label: "Total", value: "total", index: 0, color: colors.black },
  { label: ">0.001", value: "gte_0_001", index: 1, color: colors.orange },
  { label: ">0.01", value: "gte_0_01", index: 2, color: colors.orange },
  { label: ">0.1", value: "gte_0_1", index: 3, color: colors.orange },
  { label: ">1", value: "gte_1", index: 4, color: colors.green },
  { label: ">10", value: "gte_10", index: 5, color: colors.green },
  { label: ">100", value: "gte_100", index: 6, color: colors.green },
  { label: ">1k", value: "gte_1k", index: 7, color: colors.blue },
  { label: ">10k", value: "gte_10k", index: 8, color: colors.blue },
  { label: ">100k", value: "gte_100k", index: 9, color: colors.blue },
  { label: ">1M", value: "gte_1m", index: 10, color: colors.pink },
];


const Addresses = () => {
  const id = "addresses";
  return (
    <MetricTemplate id={id} name="Addresses">
      <Card>
        <SeriesChart
          id={id}
          api="/metrics/addresses/series"
          seriesOptions={seriesOptions}
          initialOptions={[0, 1]}
          yLabel="Wallet Addresses"
          ySize={70}
        />
      </Card>
      <Card title="Description">
        <p>Number of unique P2PK addresses by minimum balance.</p>
        <p>Updates every 24h, first block of day UTC.</p>
      </Card>
      <Card title="Change Summary">
        <ChangeSummary
          id={id}
          headers={["Minimal balance", "Current", "1 Day", "1 Week", "4 Weeks", "6 Months ", "1 Year"]}
          fields={["latest", "diff_1d", "diff_1w", "diff_4w", "diff_6m", "diff_1y"]}
          keys={[
            "total",
            "gte_0_001",
            "gte_0_01",
            "gte_0_1",
            "gte_1",
            "gte_10",
            "gte_100",
            "gte_1k",
            "gte_10k",
            "gte_100k",
            "gte_1m",
          ]}
          labels={{
            total: "All addresses",
            gte_0_001: "0.001 ERG",
            gte_0_01: "0.01 ERG",
            gte_0_1: "0.1 ERG",
            gte_1: "1 ERG",
            gte_10: "10 ERG",
            gte_100: "100 ERG",
            gte_1k: "1k ERG",
            gte_10k: "10k ERG",
            gte_100k: "100k ERG",
            gte_1m: "1M ERG",
          }}
        />
      </Card>
    </MetricTemplate>
  )
}

export default Addresses;
