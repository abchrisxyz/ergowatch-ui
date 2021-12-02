import { useState } from "react";

import Card from "../../components/card";
import colors from "../../config/colors";
import { AddressLink } from "../../components/links";
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
  const id = "tvl";

  const [relative, setRelative] = useState(true);

  return (
    <MetricTemplate id={id} name="TVL">

      <Card>
        <SeriesChart
          api="/metrics/tvl/series"
          seriesOptions={seriesOptions}
          initialOptions={[1,]}
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
        <p>ERG supply in top <i>x</i> contract addresses, excluding the Ergo <AddressLink address="4L1ktFSzm3SH1UioDuUf5hyaraHird4D2dEACwQ1qHGjSKtA6KaNvSzRCZXZGf9jkfNAEC1SrYaZmCuvb2BKiXk5zW9xuvrXFT7FdNe2KqbymiZvo5UQLAm5jQY8ZBRhTZ4AFtZa1UF5nd4aofwPiL7YkJuyiL5hDHMZL1ZnyL746tHmRYMjAhCgE7d698dRhkdSeVy">treasury</AddressLink></p>
      </Card>
      <Card title="Change Summary">
        <ChangeSummary
          id={id}
          headers={["Subset", "Last", "1 Day", "1 Week", "4 Weeks", "6 Months ", "1 Year"]}
          fields={["latest", "diff_1d", "diff_1w", "diff_4w", "diff_6m", "diff_1y"]}
          keys={["top10", "top100", "top1k", "total"].map(f => relative ? f + "_rel" : f)}
          labels={{
            top10: "Top 10",
            top100: "Top 100",
            top1k: "Top 1k",
            total: "All",

            top10_rel: "Top 10",
            top100_rel: "Top 100",
            top1k_rel: "Top 1k",
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