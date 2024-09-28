import './AMM.css';
import { useState, useCallback } from "react";
import { MockXFI_ABI, MockXFI_Address, MockMPX_ABI, MockMPX_Address, AMM_ABI, AMM_Address } from '../abi/constants';
import { useAccount, useReadContract, } from "wagmi";
import { waitForTransactionReceipt, readContract, writeContract } from 'wagmi/actions';
import { config } from "../blockchain/config";
import toast from "react-hot-toast";

const LendBorrow = () => {
  const [action, setAction] = useState("swap");
  const [amount, setAmount] = useState("");
  const [tokenA, setTokenA] = useState("XFI");
  const [tokenB, setTokenB] = useState("MPX");
  const [isApproving, setIsApproving] = useState(false);
  const [enableSwap, setEnableSwap] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [minOutputAmount, setMinOutputAmount] = useState(null);
  const { address, isDisconnected } = useAccount();

  const { data: xfiBalance, refetch: refetchXfiBalance } = useReadContract({
    address: MockXFI_Address,
    abi: MockXFI_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: mpxBalance, refetch: refetchMpxBalance } = useReadContract({
    address: MockMPX_Address,
    abi: MockMPX_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: xfiLiquidity, refetch: refetchXfiLiquidity } = useReadContract({
    address: AMM_Address,
    abi: AMM_ABI,
    functionName: 'assets',
    args: [0], // For XFI
    watch: true,
  });

  const { data: mpxLiquidity, refetch: refetchMpxLiquidity } = useReadContract({
    address: AMM_Address,
    abi: AMM_ABI,
    functionName: 'assets',
    args: [1], // For MPX
    watch: true,
  });


  const handleSwap = useCallback(async () => {
    const inputIndex = tokenA === "XFI" ? 0 : 1;
    const outputIndex = tokenB === "XFI" ? 0 : 1;
    const inputAmount = parseFloat(amount);
    const _minOutputAmount = parseFloat(minOutputAmount);

    try {
      await toast.promise((async () => {
        const hash = await writeContract(config, {
          address: AMM_Address,
          abi: AMM_ABI,
          functionName: 'swap',
          args: [inputIndex, outputIndex, inputAmount, _minOutputAmount],
        });
        await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 3 });
        console.log('Swap successful:', hash);
      })(), {
        error: "Swap error:",
        loading: "Swapping...",
        success: "Swap successful!",
      })

      await refetchMpxBalance();
      await refetchXfiBalance();
    } catch (error) {
      console.error('Swap error:', error);
    }
  }, [amount, minOutputAmount, refetchMpxBalance, refetchXfiBalance, tokenA, tokenB]);

  const handleAddLiquidity = useCallback(async () => {
    const amounts = amount.split(',').map((amt) => parseFloat(amt.trim()));
    console.log(">>>>>>>", amounts);
    try {

      await toast.promise((async () => {
        const hash = await writeContract(config, {
          address: AMM_Address,
          abi: AMM_ABI,
          functionName: 'addLiquidity',
          args: [amounts],
        });
        await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 2 });
        console.log('Liquidity added successfully:', hash);
      })(), {
        loading: "Adding liquidity...",
        success: "Liquidity added successfully!",
        error: "Add liquidity error:",
      })
      await refetchXfiLiquidity();
      await refetchMpxLiquidity();
      await refetchXfiBalance();
      await refetchMpxBalance();
    } catch (error) {
      console.error('Add liquidity error:', error);
    }
  }, [amount, refetchXfiLiquidity, refetchMpxLiquidity, refetchXfiBalance, refetchMpxBalance]);


  const handleRemoveLiquidity = useCallback(async () => {
    const lpTokenAmount = parseFloat(amount);

    try {
      await toast.promise((async () => {
        const hash = await writeContract(config, {
          address: AMM_Address,
          abi: AMM_ABI,
          functionName: 'removeLiquidity',
          args: [lpTokenAmount],
        });
        await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 3 });
        console.log('Liquidity removed successfully:', hash);
      })(), {
        error: "Remove liquidity error:",
        loading: "Removing liquidity...",
        success: "Liquidity removed successfully!",
      })
      await refetchXfiLiquidity();
    } catch (error) {
      console.error('Remove liquidity error:', error);
    }
  }, [amount, refetchXfiLiquidity]);

  const handleApprove = useCallback(async (token) => {
    const args = {
      functionName: 'approve',
      args: [AMM_Address, 1000], // Approve AMM contract to spend tokens
      // account: senderAddress
    }

    if (token === "XFI") {
      args.address = MockXFI_Address;
      args.abi = MockXFI_ABI;
    } else {
      args.address = MockMPX_Address;
      args.abi = MockMPX_ABI;
    }

    try {
      setIsApproving(true);
      await toast.promise((async () => {
        const hash = await writeContract(config, args);
        await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 3 });
        console.log(">>>>>>>", hash);
        setIsApproving(false);
      })(), {
        error: "Approval error:",
        loading: "Approving...",
        success: "Approved!",
      });

      return true;
    } catch (error) {
      console.error('Approval error:', error);
      setIsApproving(false);
      return false;
    }
  }, []);

  const handleTransferTokens = useCallback(async (token) => {
    const args = {
      functionName: 'transferToken',
      args: [1000],
      // account: senderAddress
    }

    if (token === "XFI") {
      args.address = MockXFI_Address;
      args.abi = MockXFI_ABI;
    } else {
      args.address = MockMPX_Address;
      args.abi = MockMPX_ABI;
    }

    try {
      setIsTransferring(true);
      await toast.promise((async () => {
        const hash = await writeContract(config, args);
        await waitForTransactionReceipt(config, { hash, pollingInterval: 1000, confirmations: 3 });
        setIsTransferring(false);
        console.log('Transfer successful:', hash);
      })(), {
        error: "Transfer error:",
        loading: "Transferring...",
        success: "Transfer successful!",
      })

      if (token === "XFI") {
        await refetchXfiBalance();
      } else {
        await refetchMpxBalance();
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setIsTransferring(false);
    }
  }, [refetchXfiBalance, refetchMpxBalance]);

  const handleFaucet = useCallback(async (token) => {
    if (token === "XFI") {
      const approvalSuccess = await handleApprove('XFI');
      if (approvalSuccess) {
        await handleTransferTokens('XFI');
      } else {
        console.error('Approval failed, cannot proceed with transfer');
      }
    } else {
      try {
        const approve = await handleApprove('MPX');
        if (!approve) {
          console.error('Approval failed, cannot proceed with transfer');
          return;
        }
        await handleTransferTokens('MPX');
      } catch (error) {
        console.error('MPX Faucet error:', error);
      }
    }
  }, [handleApprove, handleTransferTokens]);

  const handleCalculateOutputAmount = useCallback(async () => {
    const inputIndex = tokenA === "XFI" ? 0 : 1;
    const outputIndex = tokenB === "XFI" ? 0 : 1;
    const inputAmount = parseFloat(amount);

    try {
      const data = await readContract(config, {
        address: AMM_Address,
        abi: AMM_ABI,
        functionName: 'calculateOutputAmount',
        args: [inputIndex, outputIndex, inputAmount],
      });

      setMinOutputAmount(parseFloat(data));
      setEnableSwap(true);
    } catch (error) {
      console.error('Error calculating output amount:', error);
    }
  }, [amount, tokenA, tokenB]);

  const renderActionContent = () => {
    switch (action) {
      case "swap":
        return (
          <div className="action-content">
            <h3>Swap Tokens</h3>
            <p>Swap your tokens with a dynamic 2% fee. Fees are distributed to liquidity providers.</p>
            <div className="token-inputs">
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setEnableSwap(false)
                }}
                placeholder="Amount"
                className="amount-input"
              />
              <select
                value={tokenA}
                onChange={(e) => {
                  let token = e.target.value;
                  setTokenA(token);
                  setTokenB(token === "XFI" ? "MPX" : "XFI");
                  setEnableSwap(false);
                  setMinOutputAmount(null)
                }}
                className="token-select"
              >
                <option value="XFI">XFI</option>
                <option value="MPX">MPX</option>
              </select>
              <span className="to-span">to</span>
              <select
                value={tokenB}
                className="token-select"
                disabled
              >
                <option value="MPX">MPX</option>
                <option value="XFI">XFI</option>
              </select>
            </div>
            <div className="swap-buttons">
              <button onClick={handleCalculateOutputAmount} disabled={isDisconnected || !amount}>
                Calculate Min Output
              </button>
              {minOutputAmount && (
                <p>Minimum Output Amount: {minOutputAmount} {tokenB}</p>
              )}
              <button onClick={handleSwap} disabled={isDisconnected || !amount || !enableSwap}>
                Swap
              </button>
            </div>
          </div>
        );
      case "addLiquidity":
        return (
          <div className="action-content">
            <h3>Add Liquidity</h3>
            <p>Provide liquidity to earn fees from trades. Receive LP tokens representing your share of the pool.</p>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount of each token (e.g., 100,200)"
              className="amount-input"
            />
            <button onClick={handleAddLiquidity} disabled={isDisconnected || !amount}>
              Add Liquidity
            </button>
          </div>
        );
      case "removeLiquidity":
        return (
          <div className="action-content">
            <h3>Remove Liquidity</h3>
            <p>Remove your liquidity and receive back your share of the token pool.</p>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount of LP tokens"
              className="amount-input"
            />
            <button onClick={handleRemoveLiquidity} disabled={isDisconnected || !amount}>
              Remove Liquidity
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="amm-container">
      <h2>Automated Market Maker (AMM)</h2>
      <div className="balance-section">
        <p>Your XFI Balance: {xfiBalance?.toString() ?? "Loading..."}</p>
        <p>Your MPX Balance: {mpxBalance?.toString() ?? "Loading..."}</p>
        <h2>Your Liquidity</h2>
        <p>XFI Liquidity: {xfiLiquidity ? xfiLiquidity[1].toString() : "Loading..."}</p>
        <p>MPX Liquidity: {mpxLiquidity ? mpxLiquidity[1].toString() : "Loading..."}</p>
      </div>
      <div className="action-buttons">
        <button onClick={() => setAction("swap")}>Swap</button>
        <button onClick={() => setAction("addLiquidity")}>Add Liquidity</button>
        <button onClick={() => setAction("removeLiquidity")}>Remove Liquidity</button>
      </div>
      {renderActionContent()}
      <div className="faucet-buttons">
        <button
          onClick={() => handleFaucet("XFI")}
          disabled={isApproving || isTransferring}
        >
          {isApproving ? "Approving..." : isTransferring ? "Transferring..." : "Faucet XFI"}
        </button>
        <button onClick={() => handleFaucet("MPX")} disabled={isApproving || isTransferring}>
          {isApproving ? "Approving..." : isTransferring ? "Transferring..." : "Faucet MPX"}
        </button>
      </div>
    </div>
  );
};

export default LendBorrow;