import { useState } from "react";
import { Link } from "react-router-dom";
import Web3Button from "./Web3Button";
import StakeXFI from "./StakeXFI";
import LendBorrow from "./LendBorrow";
import SwapTokens from "./SwapTokens";
import animationData from "../assets/lottie.json";
import Lottie from 'react-lottie';

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const Navbar = () => {
  const [showAll, setShowAll] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);

  // The buttons to display with corresponding component references
  const buttons = [
    { label: "Liquidity Staking", component: <StakeXFI /> },
    { label: "AMM", component: <LendBorrow /> },
    { label: "Lending/Borrowing", component: <SwapTokens /> },
  ];

  // Toggle the display of all buttons
  const toggleShowAll = () => {
    setShowAll(!showAll); // Toggle between showing all or only 2
  };

  // Handle button click
  const handleButtonClick = (component) => {
    setSelectedButton(component);
  };

  return (
    <div className="crypto">
      <nav className="navbar">
        <div className="web3-button-container">
          <Web3Button className="w3m-button" />
        </div>
      </nav>
      <div className="content">
        <div className="left-side">
          <h1>The <span>most</span> secure crypto <span>trading</span> center</h1>
          <p>Buy, trade, and hold over 600 cryptocurrencies in crypto.</p>
          <div className="button-toggle-container">
            <div className={`buttons-wrapper ${showAll ? "show-all" : ""}`}>
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className="token-button"
                  onClick={() => handleButtonClick(button.component)}
                >
                  {button.label}
                </button>
              ))}
            </div>
            <div className="dynamic-component">
              {selectedButton}
            </div>
            <div className="balance-amount">
              {selectedButton && (
                <div className="selected-link">
                  <Link to="#" className="nav-link"></Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="right-side">
          <div className="stats">
            <h1>$76 Billion</h1>
            <h1>24h trading volume</h1>
            <h1>600+ Cryptocurrencies listed</h1>
            <h1>80 million Registered users</h1>
            <h1>0.10% Lowest transaction fees</h1>
          </div>
          <div className="floating-crypto">
            <Lottie options={lottieOptions}
              height={200}
              width={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
