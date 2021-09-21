import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import BreadCrumbs from "../../components/breadcrumbs";
import Card from "../../components/card";
import { StatGroup, Stat } from "../../components/stats";
import History from "./history";
import SigRSVChart from "./sigrsvchart";
import { createBank, fromNano, calcSCRate, calcRCRate, calcMintableSC, calcMintableRC, calcRedeemableRC, calcLiabilities, calcEquity, calcReserveRatio } from "./ageusd";
import { API_ROOT } from "../../config";
import './sigmausd.css';


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
  const price = fromNano(calcSCRate(bank, pegRate));
  const tvl = fromNano(bank.baseReserves) / price;
  return (
    <StatGroup>
      <Stat label="Total" value={`${Number(fromNano(bank.baseReserves).toFixed(2)).toLocaleString('en')} ERG`} />
      <Stat label="Liabilities" value={`${Number(liabilities.toFixed(2)).toLocaleString('en')} ERG`} />
      <Stat label="Equity" value={`${Number(equity.toFixed(2)).toLocaleString('en')} ERG`} />
      <Stat label="Ratio (RR)" value={`${rr.toFixed(0)} %`} />
      <Stat label="TVL" value={`$${Number(tvl.toFixed(0)).toLocaleString('en')}`} />
    </StatGroup>
  );
}

const SigmaUSD = () => {
  const [bank, setBank] = useState(undefined);
  const [pegRate, setPegRate] = useState(undefined);
  const [balanceData, setBalanceData] = useState(undefined)
  const [invertErgRsvChart, setInvertErgRsvChart] = useState(false);

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
        <Card
          title={invertErgRsvChart ? "ERG/SigRSV" : "SigRSV/ERG"}
          option={<button onClick={() => setInvertErgRsvChart(!invertErgRsvChart)}>&#8596;</button>}
        >
          <SigRSVChart inverted={invertErgRsvChart} />
        </Card>
        <Card title="History">
          <History />
        </Card>
      </div>
    </main>
  )
}

export default SigmaUSD;