import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { createChart, CrosshairMode } from 'lightweight-charts';
import ReactTooltip from 'react-tooltip';

import BreadCrumbs from "../../components/breadcrumbs";
import Card from "../../components/card";
import { StatGroup, Stat } from "../../components/stats";
import History from "./history";
import { createBank, fromNano, calcSCRate, calcRCRate, calcMintableSC, calcMintableRC, calcRedeemableRC, calcLiabilities, calcEquity, calcReserveRatio } from "./ageusd";
import { API_ROOT } from "../../config";
import './sigmausd.css';

const SigRSVChart = () => {
  const containerRef = useRef(0);
  const chartRef = useRef(0);
  const [seriesData, setSeriesData] = useState(undefined);

  useEffect(() => {
    const qry = API_ROOT + "/sigmausd/ohlc/sigrsv/1d";
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

const SigUSD = ({ pegRate, bank, balanceData }) => {
  if (pegRate === undefined || bank === undefined || balanceData === undefined) return "";
  const price = fromNano(calcSCRate(bank, pegRate));
  const mintable = calcMintableSC(bank, pegRate);
  const redeemable = bank.scCirc;
  const liabilities = fromNano(calcLiabilities(bank, pegRate));
  const roi = (-balanceData.net_sc_erg + liabilities) / balanceData.cum_sc_erg_in * 100;
  return (
    <StatGroup>
      <Stat label="Circulating" value={bank.scCirc.toLocaleString('en')} />
      <Stat label="Price" value={`${price.toFixed(2)} ERG`} />
      <Stat label="Rate" value={`1 ERG = ${(1 / price).toFixed(2)} SigUSD`} />
      <Stat label="Mintable" value={Number(mintable.toFixed(2)).toLocaleString('en')} />
      <Stat label="Redeemable" value={Number(redeemable.toFixed(2)).toLocaleString('en')} />
      <Stat label="Average ROI" value={Number(roi.toFixed(2)).toLocaleString('en') + " %"} tip="All time average ROI,<br/>including current liabilities" />
    </StatGroup>
  );
}

const SigRSV = ({ pegRate, bank, balanceData }) => {
  if (pegRate === undefined || bank === undefined || balanceData === undefined) return "";
  const price = fromNano(calcRCRate(bank, pegRate));
  const mintable = calcMintableRC(bank, pegRate);
  const redeemable = calcRedeemableRC(bank, pegRate);
  const liabilities = fromNano(calcLiabilities(bank, pegRate));
  const roi = (balanceData.net_sc_erg - liabilities) / balanceData.cum_rc_erg_in * 100;
  return (
    <StatGroup>
      <Stat label="Circulating" value={bank.rcCirc.toLocaleString('en')} />
      <Stat label="Price" value={`${price.toFixed(8)} ERG`} />
      <Stat label="Rate" value={`1 ERG = ${(1 / price).toFixed(2)} SigRSV`} />
      <Stat label="Mintable" value={Number(mintable.toFixed(2)).toLocaleString('en')} />
      <Stat label="Redeemable" value={Number(redeemable.toFixed(2)).toLocaleString('en')} />
      <Stat label="Average ROI" value={Number(roi.toFixed(2)).toLocaleString('en') + " %"} tip="All time average ROI,<br/>including current equity" />
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
  const [balanceData, setBalanceData] = useState(undefined)

  useEffect(() => {
    const qry = API_ROOT + "/sigmausd/state";
    fetch(qry)
      .then(res => res.json())
      .then(res => {
        setBank(createBank(res.circ_sigusd, res.circ_sigrsv, res.reserves));
        setPegRate(res.peg_rate_nano);
        setBalanceData({
          net_sc_erg: res.net_sc_erg, // total erg into - total erg out of contract from usd txs
          net_rc_erg: res.net_rc_erg, // total erg into - total erg out of contract from rsv txs
          cum_sc_erg_in: res.cum_sc_erg_in, // total erg into contract from usd txs
          cum_rc_erg_in: res.cum_rc_erg_in, // total erg into contract from rsv txs
        });
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
            <SigUSD bank={bank} pegRate={pegRate} balanceData={balanceData} />
          </Card>
          <Card title="SigRSV">
            <SigRSV bank={bank} pegRate={pegRate} balanceData={balanceData} />
          </Card>
          <Card title="Reserves">
            <Reserve bank={bank} pegRate={pegRate} />
          </Card>
        </div>
        <Card title="SigRSV/ERG">
          <SigRSVChart />
        </Card>
        <Card title="History">
          <History />
        </Card>
      </div>
    </main>
  )
}

export default SigmaUSD;