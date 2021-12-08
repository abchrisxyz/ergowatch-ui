import { useState } from 'react';

import Card from "../../components/card";
import colors from "../../config/colors";
import SeriesChart from "./common/series-chart";
import MetricTemplate from "./common/template";
import ChangeSummary from "./common/change-summary";


const seriesOptions = [
  { label: "Top 10", value: "top10", index: 0, color: colors.black },
  { label: "Top 100", value: "top100", index: 1, color: colors.orange },
  { label: "Top 1k", value: "top1k", index: 2, color: colors.green },
  // { label: "Top 10k", value: "top10k", index: 3, color: colors.blue },
  { label: "Total", value: "total", index: 4, color: colors.pink },
];

const Distribution = () => {
  const id = "distribution";

  const [relative, setRelative] = useState(true);

  return (
    <MetricTemplate id={id} name="Distribution">
      <Card>
        <SeriesChart
          api="/metrics/distribution/series"
          seriesOptions={seriesOptions}
          initialOptions={[1,]}
          yLabel={relative ? "% of Circ. Supply" : "ERG"}
          ySize={relative ? 65 : 80}
          setRelative={setRelative}
          relative={relative}
          relativeTo="circulating_supply"
          toFixed={relative ? 2 : 0}
          units={relative ? "%" : ""}
        />
      </Card>
      <Card title="Description">
        <p>ERG supply in top <i>x</i> wallet (P2PK) addresses.</p>
        <p>Excludes <b>known</b> exchange addresses. See <a href="/metrics/cexs">Exchanges</a> for details.</p>
        <p>Updates every 24 hours.</p>
      </Card>
      <Card title="Change Summary">
        <ChangeSummary
          id={id}
          headers={["Addresses", "Last", "1 Day", "1 Week", "4 Weeks", "6 Months ", "1 Year"]}
          fields={["latest", "diff_1d", "diff_1w", "diff_4w", "diff_6m", "diff_1y"]}
          keys={["top10", "top100", "top1k", "top10k", "total"].map(f => relative ? f + "_rel" : f)}
          labels={{
            top10: "Top 10",
            top100: "Top 100",
            top1k: "Top 1k",
            top10k: "Top 10k",
            total: "All",

            top10_rel: "Top 10",
            top100_rel: "Top 100",
            top1k_rel: "Top 1k",
            top10k_rel: "Top 10k",
            total_rel: "All",
          }}
          toFixed={relative ? 2 : 0}
          units={relative ? "%" : ""}
        />
      </Card>
    </MetricTemplate>
  )
}

export default Distribution;
