import { Link } from "react-router-dom";

import { AddressLink } from "../../../components/links";
import BreadCrumbs from "../../../components/breadcrumbs";
import Card from "../../../components/card";
import colors from "../../../config/colors";
import SeriesChart from "../series-chart";

import './distribution.css';

const seriesOptions = [
  { label: "Top 10", value: "top10", index: 0, color: colors.black },
  { label: "Top 100", value: "top100", index: 1, color: colors.orange },
  { label: "Top 1k", value: "top1k", index: 2, color: colors.green },
  { label: "Top 10k", value: "top10k", index: 3, color: colors.blue },
  { label: "CEX's", value: "cexs", index: 4, color: colors.pink },
];

const Distribution = () => {
  return (
    <main>
      <h1>Distribution</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/metrics">Metrics</Link>
        <Link to="/metrics/distribution">Distribution</Link>
      </BreadCrumbs>
      <div className="metrics">
        <Card title="Summary">
          <div className="summary">

          </div>
        </Card>
      </div>
      <Card title="Chart">
        <SeriesChart
          api="/metrics/distribution/series"
          seriesOptions={seriesOptions}
          initialOptions={[0, 1]}
        />
      </Card>
      <Card title="Description">
        <p>ERG supply in top <i>x</i> addresses.</p>
        <div>
          The following addresses are <i>not</i> included:
          <ul>
            <li>Ergo <AddressLink address="2Z4YBkDsDvQj8BX7xiySFewjitqp2ge9c99jfes2whbtKitZTxdBYqbrVZUvZvKv6aqn9by4kp3LE1c26LCyosFnVnm6b6U1JYvWpYmL2ZnixJbXLjWAWuBThV1D6dLpqZJYQHYDznJCk49g5TUiS4q8khpag2aNmHwREV7JSsypHdHLgJT7MGaw51aJfNubyzSKxZ4AJXFS27EfXwyCLzW1K6GVqwkJtCoPvrcLqmqwacAWJPkmh78nke9H4oT88XmSbRt2n9aWZjosiZCafZ4osUDxmZcc5QVEeTWn8drSraY3eFKe8Mu9MSCcVU">coinbase</AddressLink></li>
            <li>Ergo <AddressLink address="4L1ktFSzm3SH1UioDuUf5hyaraHird4D2dEACwQ1qHGjSKtA6KaNvSzRCZXZGf9jkfNAEC1SrYaZmCuvb2BKiXk5zW9xuvrXFT7FdNe2KqbymiZvo5UQLAm5jQY8ZBRhTZ4AFtZa1UF5nd4aofwPiL7YkJuyiL5hDHMZL1ZnyL746tHmRYMjAhCgE7d698dRhkdSeVy">treasury</AddressLink></li>
            <li><AddressLink address="MUbV38YgqHy7XbsoXWF5z7EZm524Ybdwe5p9WDrbhruZRtehkRPT92imXer2eTkjwPDfboa1pR3zb3deVKVq3H7Xt98qcTqLuSBSbHb7izzo5jphEpcnqyKJ2xhmpNPVvmtbdJNdvdopPrHHDBbAGGeW7XYTQwEeoRfosXzcDtiGgw97b2aqjTsNFmZk7khBEQywjYfmoDc9nUCJMZ3vbSspnYo3LarLe55mh2Np8MNJqUN9APA6XkhZCrTTDRZb1B4krgFY1sVMswg2ceqguZRvC9pqt3tUUxmSnB24N6dowfVJKhLXwHPbrkHViBv1AKAJTmEaQW2DN1fRmD9ypXxZk8GXmYtxTtrj3BiunQ4qzUCu1eGzxSREjpkFSi2ATLSSDqUwxtRz639sHM6Lav4axoJNPCHbY8pvuBKUxgnGRex8LEGM8DeEJwaJCaoy8dBw9Lz49nq5mSsXLeoC4xpTUmp47Bh7GAZtwkaNreCu74m9rcZ8Di4w1cmdsiK1NWuDh9pJ2Bv7u3EfcurHFVqCkT3P86JUbKnXeNxCypfrWsFuYNKYqmjsix82g9vWcGMmAcu5nagxD4iET86iE2tMMfZZ5vqZNvntQswJyQqv2Wc6MTh4jQx1q2qJZCQe4QdEK63meTGbZNNKMctHQbp3gRkZYNrBtxQyVtNLR8xEY8zGp85GeQKbb37vqLXxRpGiigAdMe3XZA4hhYPmAAU5hpSMYaRAjtvvMT3bNiHRACGrfjvSsEG9G2zY5in2YWz5X9zXQLGTYRsQ4uNFkYoQRCBdjNxGv6R58Xq74zCgt19TxYZ87gPWxkXpWwTaHogG1eps8WXt8QzwJ9rVx6Vu9a5GjtcGsQxHovWmYixgBU8X9fPNJ9UQhYyAWbjtRSuVBtDAmoV1gCBEPwnYVP5GCGhCocbwoYhZkZjFZy6ws4uxVLid3FxuvhWvQrVEDYp7WRvGXbNdCbcSXnbeTrPMey1WPaXX">SigmaUSD V2</AddressLink></li>
            <li>Known addresses from
              KuCoin (<AddressLink address="9hU5VUSUAmhEsTehBKDGFaFQSJx574UPoCquKBq59Ushv5XYgAu"  >1</AddressLink>)
              , Coinex (<AddressLink address="9fowPvQ2GXdmhD2bN54EL9dRnio3kBQGyrD3fkbHwuTXD6z1wBU" >1</AddressLink>, <AddressLink address="9fPiW45mZwoTxSwTLLXaZcdekqi72emebENmScyTGsjryzrntUe" >2</AddressLink>)
              and Gate.io (<AddressLink address="9iKFBBrryPhBYVGDKHuZQW7SuLfuTdUJtTPzecbQ5pQQzD4VykC" >1</AddressLink>)</li>
          </ul>
        </div>

      </Card>
    </main>
  )
}

export default Distribution;