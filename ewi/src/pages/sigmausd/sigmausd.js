import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";
import { createChart, CrosshairMode } from 'lightweight-charts';

import BreadCrumbs from "../../components/breadcrumbs";
import Card from "../../components/card";
import { StatGroup, Stat } from "../../components/stats";
import { createBank, fromNano, calcSCRate, calcRCRate, calcMintableSC, calcMintableRC, calcRedeemableRC, calcLiabilities, calcEquity, calcReserveRatio } from "./ageusd";

import './sigmausd.css';


function formatTimestamp(t) {
  const d = new Date(t)
  const f = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return f.format(d);
}

function makeTicks(firstTimestamp) {
  const first = new Date(firstTimestamp);
  const second = new Date(firstTimestamp)
  second.setMonth(first.getMonth() + 1);
  second.setDate(1);
  second.setHours(0);
  second.setMinutes(0);
  second.setSeconds(0);
  second.setMilliseconds(0);
  const now = new Date();
  const ticks = [first];
  var next = second;
  while (next < now) {
    ticks.push(new Date(next));
    next = new Date(next.setMonth(next.getMonth() + 1))
  }
  ticks.push(now);
  return ticks.map((d) => d.valueOf());
}

const SigRSVChart = () => {
  const containerRef = useRef(0);
  const chartRef = useRef(0);
  const [seriesData, setSeriesData] = useState(undefined);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/sigmausd/ohlc/sigrsv/1d";
    fetch(qry)
      .then(res => res.json())
      .then(res => setSeriesData(res))
      .catch(err => console.error(err));
  }, []);

  useLayoutEffect(() => {
    if (seriesData === undefined) return;

    const chart = createChart(chartRef.current, {
      width: 600,
      height: 300,
      layout: {
        backgroundColor: 'rgb(250 250 250)',
        textColor: '#131021',
      },
      rightPriceScale: {
        borderColor: 'gray',
      },
      timeScale: {
        borderColor: 'gray',
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceFormat: {
        type: 'custom',
        minMove: 0.00000001,
        // precision: 8,
        formatter: (price) => parseFloat(price).toFixed(6),
      },
      // priceScale: {
      //   autoScale: false
      // },
      localization: {
        locale: 'en-US',
        priceFormatter: (price) => parseFloat(price).toFixed(6)
      },
    });

    const series = chart.addCandlestickSeries();
    series.setData(seriesData);

    series.applyOptions({
      priceFormat: {
        precision: 6,
        minMove: 0.000001,
      },
    });

    // chart.timeScale().fitContent();

    new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== containerRef.current) {
        return;
      }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ width: newRect.width - 10 });
    }).observe(containerRef.current);

  }, [seriesData]);

  return (
    <div ref={containerRef}>
      <div ref={chartRef}></div>
    </div>
  );
}

const SigUSDFlow = () => {
  const [data, setData] = useState(undefined);
  const [liabs, setLiabs] = useState(undefined);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/sigmausd/net-sigusd-flow";
    fetch(qry)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/sigmausd/liabilities";
    fetch(qry)
      .then(res => res.json())
      .then(res => setLiabs(res))
      .catch(err => console.error(err));
  }, []);


  if (data === undefined || liabs === undefined) return "";

  const ticks = makeTicks(data[0].t)

  return (
    <div>
      <ResponsiveContainer width="99%" height={250}>
        <LineChart margin={{ top: 1, left: 10, right: 50, bottom: 40 }}>
          <Line data={data} type="monotone" dataKey="v" dot={false} strokeWidth={1} isAnimationActive={false} />
          <Line data={liabs} type="monotone" dataKey="v" dot={false} strokeWidth={1} isAnimationActive={false} stroke="red" />
          <CartesianGrid stroke="#ccc" strokeDasharray="2 2" />
          <XAxis
            dataKey="t"
            type="number"
            angle={45}
            dx={25}
            dy={30}
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatTimestamp}
            ticks={ticks}
            tickMargin={1} />
          <YAxis tickMargin={10} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const SigRSVFlow = () => {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/sigmausd/net-sigrsv-flow";
    fetch(qry)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  if (data === undefined) return "";

  const ticks = makeTicks(data[0].t)

  return (
    <div>
      <ResponsiveContainer width="99%" height={250}>
        <LineChart data={data} margin={{ top: 1, left: 10, right: 50, bottom: 40 }}>
          <Line type="monotone" dataKey="v" dot={false} strokeWidth={1} isAnimationActive={false} />
          <CartesianGrid stroke="#ccc" strokeDasharray="2 2" />
          <XAxis
            dataKey="t"
            type="number"
            angle={45}
            dx={25}
            dy={30}
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatTimestamp}
            ticks={ticks}
            tickMargin={1} />
          <YAxis tickMargin={10} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const SigUSD = ({ pegRate, bank }) => {
  if (pegRate === undefined || bank === undefined) return "";
  const price = fromNano(calcSCRate(bank, pegRate));
  const mintable = calcMintableSC(bank, pegRate);
  const redeemable = bank.scCirc;
  return (
    <StatGroup>
      <Stat label="Circulating" value={bank.scCirc.toLocaleString('en')} />
      <Stat label="Price" value={`${price.toFixed(2)} ERG`} />
      <Stat label="Rate" value={`1 ERG = ${(1 / price).toFixed(2)} SigUSD`} />
      <Stat label="Mintable" value={Number(mintable.toFixed(2)).toLocaleString('en')} />
      <Stat label="Redeemable" value={Number(redeemable.toFixed(2)).toLocaleString('en')} />
    </StatGroup>
  );
}

const SigRSV = ({ pegRate, bank }) => {
  if (pegRate === undefined || bank === undefined) return "";
  const price = fromNano(calcRCRate(bank, pegRate));
  const mintable = calcMintableRC(bank, pegRate);
  const redeemable = calcRedeemableRC(bank, pegRate);
  return (
    <StatGroup>
      <Stat label="Circulating" value={bank.rcCirc.toLocaleString('en')} />
      <Stat label="Price" value={`${price.toFixed(8)} ERG`} />
      <Stat label="Rate" value={`1 ERG = ${(1 / price).toFixed(2)} SigRSV`} />
      <Stat label="Mintable" value={Number(mintable.toFixed(2)).toLocaleString('en')} />
      <Stat label="Redeemable" value={Number(redeemable.toFixed(2)).toLocaleString('en')} />
    </StatGroup>
  );
}

const Reserve = ({ pegRate, bank }) => {
  if (pegRate === undefined || bank === undefined) return "";
  const liabilities = fromNano(calcLiabilities(bank, pegRate));
  const equity = fromNano(calcEquity(bank, pegRate));
  const rr = calcReserveRatio(bank, pegRate);
  return (
    <StatGroup>
      <Stat label="Total" value={`${Number(fromNano(bank.baseReserves).toFixed(2)).toLocaleString('en')} ERG`} />
      <Stat label="Liabilities" value={`${Number(liabilities.toFixed(2)).toLocaleString('en')} ERG`} />
      <Stat label="Equity" value={`${Number(equity.toFixed(2)).toLocaleString('en')} ERG`} />
      <Stat label="Ratio (RR)" value={`${rr.toFixed(0)} %`} />
    </StatGroup>
  );
}

const SigmaUSD = () => {
  const [bank, setBank] = useState(undefined);
  const [pegRate, setPegRate] = useState(undefined);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/sigmausd/state";
    fetch(qry)
      .then(res => res.json())
      .then(res => {
        setBank(createBank(res.circ_sigusd, res.circ_sigrsv, res.reserves));
        setPegRate(res.peg_rate_nano);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main>
      <h1>SigmaUSD</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/sigmausd">SigmaUSD</Link>
      </BreadCrumbs>
      <div className="sigmausd">
        <div className="card-group">
          <Card title="SigUSD">
            <SigUSD bank={bank} pegRate={pegRate} />
          </Card>
          <Card title="SigRSV">
            <SigRSV bank={bank} pegRate={pegRate} />
          </Card>
          <Card title="Reserves">
            <Reserve bank={bank} pegRate={pegRate} />
          </Card>
        </div>
        <Card title="SigRSV/ERG">
          <SigRSVChart />
        </Card>
        {/* <Card title="SigUSD Net Flow">
          <SigUSDFlow />
        </Card>
        <Card title="SigRSV Net Flow">
          <SigRSVFlow />
        </Card> */}
      </div>
    </main>
  )
}

export default SigmaUSD;