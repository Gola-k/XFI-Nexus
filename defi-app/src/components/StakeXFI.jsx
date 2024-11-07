import { useState } from 'react';
import './StakeXFI.css';
import { useAccount, useReadContract, useWriteContract, } from 'wagmi';
import { STAKE_TOKEN_ABI, STAKE_TOKEN_ADDRESS, STAKING_ABI, STAKING_ADDRESS } from "../abi/constants"
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '../blockchain/config';
import toast from 'react-hot-toast';

const StakeXFI = () => {
  const [amount, setAmount] = useState('');
  const [withDraw, setWithDraw] = useState('');
  const { isDisconnected, address } = useAccount()
  const { data: stakeSTKBalance, refetch: refetchStakeSTKBalance } = useReadContract({ abi: STAKE_TOKEN_ABI, functionName: "balanceOf", address: STAKE_TOKEN_ADDRESS, args: [address], watch: true })
  const { data: STKStaked, refetch: refetchStkStaked } = useReadContract({ abi: STAKING_ABI, functionName: "stakedBalance", address: STAKING_ADDRESS, args: [address], watch: true })

  const { writeContractAsync } = useWriteContract();


  const handleStakeToken = async () => {
    // Implement staking logic here
    const approveSuccess = await handleApprove();

    if (!approveSuccess) {
      return
    }

    await toast.promise((async () => {
      const stakeHash = await writeContractAsync({ abi: STAKING_ABI, functionName: "stake", address: STAKING_ADDRESS, args: [parseInt(amount) * (10 ** 18)] });

      await waitForTransactionReceipt(config, {
        hash: stakeHash,
        pollingInterval: 1000,
        confirmations: 3
      });
    })(), {
      error: "Error staking",
      loading: "Staking",
      success: "Staked",
    })

    await refetchStakeSTKBalance();
    await refetchStkStaked();
  }

  const handleApprove = async () => {
    await toast.promise((async () => {
      const approveHash = await writeContractAsync({ abi: STAKE_TOKEN_ABI, functionName: "approve", address: STAKE_TOKEN_ADDRESS, args: [STAKING_ADDRESS, parseInt(amount) * (10 ** 18)] });

      await waitForTransactionReceipt(config, {
        hash: approveHash,
        pollingInterval: 1000,
      });

    })(), {
      error: "Error approving",
      loading: "Approving",
      success: "Approved",
    })
    return true

  }

  const handleWithdraw = async () => {

    // Implement withdrawal logic here
    const confirmation = window.confirm("Are you sure you want to withdraw? Early withdrawals will cause 10% of penalty");

    if (!confirmation) {
      return
    }

    await toast.promise((async () => {
      const withdrawHash = await writeContractAsync({ abi: STAKING_ABI, functionName: "withdrawStakedTokens", address: STAKING_ADDRESS, args: [parseInt(withDraw) * (10 ** 18)] });

      await waitForTransactionReceipt(config, {
        hash: withdrawHash,
        pollingInterval: 1000,
      });

      await Promise.all([refetchStakeSTKBalance(), refetchStkStaked()])
    }), {
      error: "Error withdrawing",
      loading: "Withdrawing",
      success: "Withdrawn",
    })
  }

  const handleGetToken = async () => {
    // Implement token retrieval logic here
    await toast.promise((async () => {
      const hash = await writeContractAsync({ abi: STAKE_TOKEN_ABI, functionName: "transferToken", address: STAKE_TOKEN_ADDRESS });
      await waitForTransactionReceipt(config, {
        hash,
        pollingInterval: 1000,
        confirmations: 2
      })
    })(), {
      error: "Error retrieving token",
      loading: "Retrieving token",
      success: "Token retrieved",
    })
  }

  return (
    <div className="stake-xfi">
      
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
      <p className='note'>If you withdraw token before 2 days of staking, you will get 10% penalty</p> <br />
      <button onClick={handleWithdraw} disabled={isDisconnected} className='send-btn_1' >Withdraw</button>


      {/* <hr className='seperator' />
      <button disabled={isDisconnected} className='send-btn_1' >Get Reward</button> */}

      <hr className='seperator' />
      <button className='send-btn_1' onClick={handleGetToken}>Get Token</button>
    </div>
  );
};

export default StakeXFI;
