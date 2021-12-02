import Card from "../../components/card";
import colors from "../../config/colors";
import SeriesChart from "./common/series-chart";
import MetricTemplate from "./common/template";


const seriesOptions = [
  { label: "Transactions", value: "transactions", index: 0, color: colors.orange },
];

const Transactions = () => {
  const id = "transactions";
  return (
    <MetricTemplate id={id} name="Transactions">
      <Card>
        <SeriesChart
          api="/metrics/transactions/series"
          seriesOptions={seriesOptions}
          initialOptions={[0,]}
          yLabel="Transactions / 24h"
          ySize={70}
          markLast={colors.blue}
        />
      </Card>
      <Card title="Description">
        <p>Total number of transactions per day.</p>
        <p>Each datapoint on the graph represents the preceding 24 hours, except for the last one showing current total since previous datapoint.</p>
      </Card>
    </MetricTemplate>
  )
}

export default Transactions;