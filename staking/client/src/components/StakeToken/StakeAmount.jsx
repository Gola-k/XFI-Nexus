import { useState, useContext, useRef } from "react";
import Button from "../Button/Button";
import Web3Context from "../../context/Web3Context";
import StakingContext from "../../context/StakingContext";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import "./StakeToken.css";

const StakeAmount = () => {
  const { stakingContract } = useContext(Web3Context);
  const { isReload, setIsReload } = useContext(StakingContext);
  const stakedTokenRef = useRef();

  const stakeToken = async (e) => {
    e.preventDefault();
    const amount = stakedTokenRef.current.value.trim();
    if (isNaN(amount) || amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToStake = ethers.parseUnits(amount, 18).toString();
    console.log(amountToStake);
    try {
      const transaction = await stakingContract.stake(amountToStake);
      console.log(transaction);
      await toast.promise(transaction.wait(), {
        loading: "Transaction is pending...",
        success: "Transaction successful 👌",
        error: "Transaction failed 🤯",
      });
      stakedTokenRef.current.value = "";
      setIsReload(!isReload);
    //   if (receipt.status == 1) {
    //     setTransactionStatus("Transaction Successful!");
    //     setIsReload(!isReload);
    //     setTimeout(() => {
    //       setTransactionStatus("");
    //     }, 5000);
        
    //   } else {
    //     setTransactionStatus("Transaction Failed!");
    //     setTimeout(() => {
    //       setTransactionStatus("");
    //     }, 5000);
    //   }
    } catch (error) {
        toast.error("Staking Failed");
        console.error(error.message)
    }
  };
  return (
    <div>
      <form onSubmit={stakeToken} className="stake-amount-form">
        <label className="stake-input-label">Enter Staking Amount:</label>
        <input type="text" ref={stakedTokenRef}></input>
        <Button onClick={stakeToken} type="submit" label="Stake Token" />
      </form>
    </div>
  );
};

export default StakeAmount;
