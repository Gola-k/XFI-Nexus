import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className='dashboard_sec'>
        <h3>Staked XFI</h3>
        <h4 className='dashboard_p'>Details about staked XFI will go here.</h4>
      </div>
      <div className='dashboard_sec'>
        <h3>Lent xXFI</h3>
        <h4 className='dashboard_p'>Details about lent xXFI will go here.</h4>
      </div>
      <div className='dashboard_sec'>
        <h3>Borrowed Assets</h3>
        <h4 className='dashboard_p'>Details about borrowed assets will go here.</h4>
      </div>
      <div className='dashboard_sec'>
        <h3>Liquidity Provided</h3>
        <h4 className='dashboard_p'>Details about liquidity provided will go here.</h4>
      </div>
    </div>
  );
};

export default Dashboard;
