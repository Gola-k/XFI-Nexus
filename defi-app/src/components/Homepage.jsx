import "./Homepage.css";


const Homepage = () => {
  return (
    <div className="homepage">
      <h1 className="title">Welcome to XFI TrifectaFinance</h1>
      <p className="description">Your gateway to decentralized finance.</p>
      <div className="buttons">
        <button><a href="/stake">Stake XFI</a></button>
        <button><a href="/lend-borrow">Lend/Borrow</a></button>
        <button><a href="/swap-tokens">Swap Tokens</a></button>
      </div>
    </div>
  );
};

export default Homepage;

