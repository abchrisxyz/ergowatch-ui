import Card from "../../components/card";
import colors from "../../config/colors";
import SeriesChart from "./common/series-chart";
import MetricTemplate from "./common/template";


const seriesOptions = [
  { label: "Mean age", value: "mean_age_days", index: 0, color: colors.orange },
];

const Age = () => {
  const id = "age";
  return (
    <MetricTemplate id={id} name="Supply Age">
      <Card>
        <SeriesChart
          api="/metrics/age/series"
          seriesOptions={seriesOptions}
          initialOptions={[0,]}
          yLabel="Days"
          ySize={50}
          toFixed={1}
        />
      </Card>
      <Card title="Description">
        <p>Mean supply age represents the average time since last change of address accross all circulating supply.</p>
      </Card>
    </MetricTemplate>
  )
}

export default Age;