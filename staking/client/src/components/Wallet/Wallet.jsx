import { useState, useEffect } from "react";
import { connectWallet } from "../../utils/connectWallet";
import Web3Context from "../../context/Web3Context";
import Button from "../Button/Button";
import { handleAccountChange } from "../../utils/handleAccountChange";
import { handleChainChange } from "../../utils/handleChainChange";

const wallet = ({children}) => {
  const [state, setState] = useState({
    provider: null,
    account: null,
    stakingContract: null,
    stakeTokenContract: null,
    chainId: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      window.ethereum.on("accountsChanged", () => handleAccountChange(setState));
      window.ethereum.on("chainChanged", () => handleChainChange(setState));
      return () => {
        window.ethereum.removeListener("accountsChanged", () => handleAccountChange(setState));
        window.ethereum.removeListener("chainChanged", () => handleChainChange(setState));
      }
  }, []);

  const handleWallet = async () => {
    try {
      setIsLoading(true);
      const {
        provider,
        selectedAccount,
        stakingContract,
        stakeTokenContract,
        chainId,
      } = await connectWallet();
      console.log("Provider: ", provider);
      console.log("Account: ", selectedAccount);
      console.log("Staking Contract: ", stakingContract);
      console.log("Stake Token Contract: ", stakeTokenContract);
      console.log("Chain ID: ", chainId);

      setState({
        provider,
        account: selectedAccount,
        stakingContract,
        stakeTokenContract,
        chainId,
      });
    } catch (error) {
      console.error("Error collecting wallet: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Web3Context.Provider value={state}>
        {children}
      </Web3Context.Provider>
      {isLoading && <p>Loading...</p>}
      <Button onClick={handleWallet} label="Connect Wallet"/>
    </div>
)
};


export default wallet;