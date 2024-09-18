import React, { useState } from 'react';
import './StakeXFI.css';

const StakeXFI = () => {
  const [amount, setAmount] = useState('');

  const handleStake = () => {
    // Implement staking logic here
    console.log(`Staking ${amount} XFI`);
  };

  return (
    <div className="stake-xfi">
      <h2>Stake XFI</h2>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="input-field"
      />
      <button onClick={handleStake} className='send-btn_1'>Stake</button>
    </div>
  );
};

export default StakeXFI;
