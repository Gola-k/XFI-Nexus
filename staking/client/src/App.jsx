import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Wallet from "./components/Wallet/Wallet"
import './App.css';
import Navigation from './components/Navigation/Navigation'
import DisplayPanel from './components/DisplayPanels/DisplayPanel'
import TokenApproval from './components/StakeToken/TokenApproval'
import StakeAmount from './components/StakeToken/StakeAmount'
import WithdrawStakeAmount from './components/Withdraw/withdraw'
import ClaimReward from './components/ClaimReward/ClaimReward'
import { StakingProvider } from './context/StakingContext';

function App() {
  const [displaySection, setDisplaySection] = useState("stake");

  const handleButtonClick = (section) => {
    setDisplaySection(section);
  };

  return (
    <div className='main-section'>
      <Wallet>
        <Navigation />
        <StakingProvider>
          <DisplayPanel />
          <div className="main-content">
            <div className="button-section">
            <button
                onClick={() => handleButtonClick("stake")}
                className={displaySection === "stake" ? "" : "active"}
              >
                Stake
              </button>
              <button
                onClick={() => handleButtonClick("withdraw")}
                className={displaySection === "withdraw" ? "" : "active"}
              >
                Withdraw
              </button>
            </div>
            {displaySection === "stake" && (
              <div className="stake-wrapper">
                <TokenApproval />
                <StakeAmount />
              </div>
            )}
            {displaySection === "withdraw" && (
              <div className="stake-wrapper">
                <WithdrawStakeAmount />
              </div>
            )}
          </div>
        </StakingProvider>
      </Wallet>
    </div>
  )
}

export default App
