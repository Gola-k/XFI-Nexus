import React, { useState } from 'react';
import './swaptokens.css';

const SwapTokens = () => {
  const [fromToken, setFromToken] = useState('XFI');
  const [toToken, setToToken] = useState('TokenY');
  const [amount, setAmount] = useState('');

  const handleSwap = () => {
    // Implement swapping logic here
    console.log(`Swapping ${amount} ${fromToken} for ${toToken}`);
  };

  return (
    <div className="swap-tokens">
      <h2>Swap Tokens</h2>
      <div>
        <button className='token-button' style={{borderRadius:"50px"}}>Lending</button>
        <button className='token-button' style={{borderRadius:"50px"}}>Borrowing</button>
      </div>
      <div className="d-amida-asfjh">
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleSwap} className='send-btn_1'>send</button>
      </div>
    </div>
  );
};

export default SwapTokens;
