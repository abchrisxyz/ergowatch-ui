import Card from "../../components/card";
import colors from "../../config/colors";
import SeriesChart from "./common/series-chart";
import MetricTemplate from "./common/template";


const seriesOptions = [
  { label: "Transfer volume", value: "transferred_volume", index: 0, color: colors.orange },
];

const TransferVolume = () => {
  const id = "transfer-volume";
  return (
    <MetricTemplate id={id} name="Transfer Volume">
      <Card>
        <SeriesChart
          api="/metrics/transfer-volume/series"
          seriesOptions={seriesOptions}
          initialOptions={[0,]}
          markLast={colors.blue}
          yLabel="ERG"
          ySize={80}
        />
      </Card>
      <Card title="Description">
        <p>The amount of ERG transfered between different addresses, excluding coinbase emission.</p>

        <p>Each datapoint on the graph represents the preceding 24 hours, except for the last one showing current total since previous datapoint.</p>

      </Card>
    </MetricTemplate>
  )
}

export default TransferVolume;