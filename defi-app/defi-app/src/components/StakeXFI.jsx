import { useState } from 'react';
import './StakeXFI.css';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { STAKE_TOKEN_ABI, STAKE_TOKEN_ADDRESS, STAKING_ABI, STAKING_ADDRESS } from "../abi/constants"
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from '../blockchain/config';

const StakeXFI = () => {
  const [amount, setAmount] = useState('');
  const [withDraw, setWithDraw] = useState('');
  const { isDisconnected, address } = useAccount()
  const { data: stakeSTKBalance, refetch: refetchStakeSTKBalance } = useReadContract({ abi: STAKE_TOKEN_ABI, functionName: "balanceOf", address: STAKE_TOKEN_ADDRESS, args: [address] })
  const { data: STKStaked, refetch: refetchStkStaked } = useReadContract({ abi: STAKING_ABI, functionName: "stakedBalance", address: STAKING_ADDRESS, args: [address] })

  const { data: lastStakeTime } = useReadContract({ abi: STAKING_ABI, functionName: "lastStakeTime", address: STAKING_ADDRESS, args: [address] });
  const { data: lockUpTime } = useReadContract({ abi: STAKING_ABI, functionName: "LOCKUP_PERIOD", address: STAKING_ADDRESS });
  console.log(Date.now(), (lastStakeTime + lockUpTime));


  const { writeContractAsync } = useWriteContract();


  const handleStakeToken = async () => {
    // Implement staking logic here
    const stakeHash = await writeContractAsync({ abi: STAKING_ABI, functionName: "stake", address: STAKING_ADDRESS, args: [parseInt(amount) * (10 ** 18)] });

    await waitForTransactionReceipt(config, {
      hash: stakeHash,
      pollingInterval: 1000,
    });

    await Promise.all([refetchStakeSTKBalance(), refetchStkStaked()])
  }

  const handleApprove = async () => {
    const approveHash = await writeContractAsync({ abi: STAKE_TOKEN_ABI, functionName: "approve", address: STAKE_TOKEN_ADDRESS, args: [STAKING_ADDRESS, parseInt(amount) * (10 ** 18)] });

    await waitForTransactionReceipt(config, {
      hash: approveHash,
      pollingInterval: 1000,
    });

  }

  const handleWithdraw = async () => {
    // Implement withdrawal logic here
    const confirmation = window.confirm("Are you sure you want to withdraw? Early withdrawals will cause 10% of penalty");

    if (!confirmation) {
      return
    }

    const withdrawHash = await writeContractAsync({ abi: STAKING_ABI, functionName: "withdrawStakedTokens", address: STAKING_ADDRESS, args: [parseInt(withDraw) * (10 ** 18)] });

    await waitForTransactionReceipt(config, {
      hash: withdrawHash,
      pollingInterval: 1000,
    });

    await Promise.all([refetchStakeSTKBalance(), refetchStkStaked()])
  }

  const handleGetToken = async () => {
    // Implement token retrieval logic here
    const hash = await writeContractAsync({ abi: STAKE_TOKEN_ABI, functionName: "transferToken", address: STAKE_TOKEN_ADDRESS });
    await waitForTransactionReceipt(config, {
      hash,
      pollingInterval: 1000,
    })
  }

  return (
    <div className="stake-xfi">
      <button className='send-btn_1' onClick={handleGetToken}>Get Token</button>
      <hr className='seperator' />
      <h2>Stake XFI  -  <small>Your Balance: {(parseInt(stakeSTKBalance) / (10 ** 18)) || 0} STK</small></h2>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="input-field"
      />
      <br />
      <button onClick={handleApprove} disabled={isDisconnected} className='send-btn_1' >Approve</button>
      <button onClick={handleStakeToken} disabled={isDisconnected} className='send-btn_1' >Stake</button>
      <hr className='seperator' />
      <h2>Withdraw XFI  -  <small>Amount Staked: {(parseInt(STKStaked) / (10 ** 18)) || 0} STK</small></h2>
      <input
        type="text"
        value={withDraw}
        onChange={(e) => setWithDraw(e.target.value)}
        placeholder="Enter withdraw amount"
        className="input-field"
      />
      <br />
      <span>If you withdraw token before 2 days of staking, you will get 10% penalty</span> <br />
      <button onClick={handleWithdraw} disabled={isDisconnected} className='send-btn_1' >Withdraw</button>
      {/* <hr className='seperator' />
      <button disabled={isDisconnected} className='send-btn_1' >Get Reward</button> */}
    </div>
  );
};

export default StakeXFI;
