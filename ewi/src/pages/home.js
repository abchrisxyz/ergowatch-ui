import './home.css';

const Home = () => {
  return (
    <main style={{ padding: 0 }}>
      <div className="banner">
        <div className="logo">
          Ergo Watch<span>beta</span>
        </div>
        <div className="description">
          Ergo blockchain stats and monitoring
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <a href="/emission">Emission</a>
        </div>
        <div className="item">
          <a href="/oracle-pools">Oracle Pools</a>
        </div>
        <div className="item">
          <a href="/sigmausd">SigmaUSD</a>
        </div>
      </div>
    </main>
  );
}

export default Home;