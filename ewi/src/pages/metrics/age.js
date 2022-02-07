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
    < MetricTemplate id={id} name="Supply Age" >
      <div style={{ maxWidth: "80%", margin: "auto", color: "9F6000", backgroundColor: "#FEEFB3", padding: "22px 12px" }}>
        {/* <h2 style={{ color: "#9F6000", fontWeight: "bold" }}>Warning</h2> */}
        <p style={{ color: "#9F6000", fontWeight: "bold" }}>
          The current mean age calculation is only based on daily transfer volume vs circulating supply.
          It does not track supply age for individual addresses, and therefore overestimates the impact of repeated transfers on age decrease.<br /><br />
          The sharp decline pictured below is reflecting Kucoin's internal transfers combined with aforementioned limitation of the mean age calculation.<br />
          A fix is coming.
        </p>
      </div>
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
        <p>Mean supply age represents the average time since last change of address across all circulating supply.</p>
        <p>Updates every 24h.</p>
      </Card>
    </MetricTemplate >
  )
}

export default Age;