import { useCallback, useState } from 'react';
import './swaptokens.css';
import { useAccount, useReadContract } from 'wagmi';
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { XFI_Lending_ABI, XFI_Lending_Address, XFI_Token_ABI, XFI_Token_Address } from '../abi/constants';
import toast from 'react-hot-toast';
import { config } from '../blockchain/config';

const SwapTokens = () => {
  const [isApproving, setApproving] = useState(false);
  const [isTransferring, setTransferring] = useState(false);
  const [amount, setAmount] = useState('');

  const { isDisconnected, address: userAccount } = useAccount();

  const { data: xfiBalance, refetch: refetchXfiBalance } = useReadContract({
    abi: XFI_Token_ABI,
    address: XFI_Token_Address,
    functionName: 'balanceOf',
    args: [userAccount],
  })
  const { data: contractBalance, refetch: refetchContractBalance } = useReadContract({
    abi: XFI_Token_ABI,
    address: XFI_Token_Address,
    functionName: 'balanceOf',
    args: [XFI_Lending_Address],
  })

  const { data: lendedTokens, refetch: refetchLendedTokens } = useReadContract({
    abi: XFI_Lending_ABI,
    address: XFI_Lending_Address,
    functionName: 'lenders',
    args: [userAccount],
  })
  const { data: borrowedTokens, refetch: refecthBorrowedTokens } = useReadContract({
    abi: XFI_Lending_ABI,
    address: XFI_Lending_Address,
    functionName: 'borrowers',
    args: [userAccount],
  })

  const handleFaucet = async () => {
    setApproving(true);
    await toast.promise((async () => {
      const hash = await writeContract(config, {
        abi: XFI_Token_ABI,
        address: XFI_Token_Address,
        functionName: 'approve',
        args: [XFI_Lending_Address, 1000],
      })
      await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 2 })
      setApproving(false);
      console.log("Approved", hash);
    })(), {
      error: "Error approving",
      loading: "Approving",
      success: "Approved",
    })

    setTransferring(true);
    await toast.promise((async () => {
      const hash = await writeContract(config, {
        abi: XFI_Token_ABI,
        address: XFI_Token_Address,
        functionName: 'transferToken',
        args: [1000],
      })
      await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 2 });
      setTransferring(false);
      console.log("Approved", hash);
    })(), {
      error: "Error transferring",
      loading: "Transferring",
      success: "Transferred",
    })

    await refetchXfiBalance();
  }

  const handleLending = useCallback(async () => {
    const tokens = parseFloat(amount);
    await toast.promise((async () => {
      const hash = await writeContract(config, {
        abi: XFI_Lending_ABI,
        address: XFI_Lending_Address,
        functionName: 'lend',
        args: [tokens],
      })
      await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 2 })
      console.log("lend successful", hash);

    })(), {
      error: "Error lending",
      loading: "Lending",
      success: "Lended",
    })

    await refetchXfiBalance();
    await refetchLendedTokens();
  }, [amount, refetchXfiBalance, refetchLendedTokens]);

  const handleBorrowing = useCallback(async () => {
    const tokens = parseFloat(amount);
    await toast.promise((async () => {
      const hash = await writeContract(config, {
        abi: XFI_Lending_ABI,
        address: XFI_Lending_Address,
        functionName: 'borrow',
        args: [tokens],
      })
      await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 2 })
      console.log("borrow successful", hash);
    })(), {
      error: "Error borrowing",
      loading: "Borrowing",
      success: "Borrowed",
    })

    await refetchXfiBalance();
    await refecthBorrowedTokens();
  }, [amount, refecthBorrowedTokens, refetchXfiBalance]);

  const handleWithdraw = useCallback(async () => {
    await toast.promise((async () => {
      const hash = await writeContract(config, {
        abi: XFI_Lending_ABI,
        address: XFI_Lending_Address,
        functionName: 'withdrawLentAmount',
        args: [],
      })
      await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 2 })
      console.log("withdrawal successful", hash);
    })(), {
      error: "Error withdrawing",
      loading: "Withdrawing",
      success: "Withdrawal Successfull",
    })

    await refetchXfiBalance();
    await refetchLendedTokens();
  }, [refetchLendedTokens, refetchXfiBalance]);


  return (
    <div className="swap-tokens">
      <h2>Lending & Borrowing :- {xfiBalance?.toString()}</h2>
      <div className='lend-borrow-data'>
        <h3>Contract Balance :- {contractBalance?.toString()}</h3>
        <h3>Lended Tokens :- {lendedTokens?.[0]?.toString()}</h3>
        <h3>Borrowed Tokens :- {borrowedTokens?.[0]?.toString()}</h3>
      </div>
      <div className="d-amida-asfjh">
        <h3 style={{ color: 'white', fontFamily: "Arial" }}>Enter Amount</h3>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="eg:- 10"
        />
        <div>
          <button onClick={handleLending} disabled={isDisconnected || isApproving || isTransferring} className='token-button' style={{ borderRadius: "50px" }}>Lending</button>
          <button onClick={handleBorrowing} disabled={isDisconnected || isApproving || isTransferring} className='token-button' style={{ borderRadius: "50px" }}>Borrowing</button>
        </div>
        {/* <button disabled={isDisconnected} className='send-btn_1'>send</button> */}
      </div>
      <div className="faucet-buttons">
        <button onClick={handleWithdraw} disabled={isDisconnected || isApproving || isTransferring}>Withdraw</button>
        <button
          onClick={() => handleFaucet()}
          disabled={isApproving || isTransferring}
        >
          {isApproving ? "Approving..." : isTransferring ? "Transferring..." : "Faucet XFI"}
        </button>
      </div>
    </div>
  );
};

export default SwapTokens;
