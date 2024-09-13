import { useState, useContext, useRef } from "react";
import Button from "../Button/Button";
import Web3Context from "../../context/Web3Context";
import StakingContext from "../../context/StakingContext";
import toast from "react-hot-toast";
import "./Withdraw.css";
import { ethers } from "ethers";

const WithdrawStakeAmount = () => {
  const { stakingContract } = useContext(Web3Context);
  const { isReload, setIsReload } = useContext(StakingContext);
  const withdrawStakedTokenRef = useRef();
  const [transactionStatus, setTransactionStatus] = useState("");
  const withdrawStakeToken = async (e) => {
    e.preventDefault();
    const amount = withdrawStakedTokenRef.current.value.trim();
    if (isNaN(amount) || amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToWithdraw = ethers.parseUnits(amount, 18).toString();
    console.log(amountToWithdraw);
    try {
      const transaction = await stakingContract.withdrawStakedTokens(
        amountToWithdraw
      );
      console.log(transaction);
      await toast.promise(transaction.wait(), {
        loading: "Transaction is pending...",
        success: "Transaction successful 👌",
        error: "Transaction failed 🤯",
      });
      withdrawStakedTokenRef.current.value = "";
      setIsReload(!isReload);
    //   const receipt = await transaction.wait();
    //   if (receipt.status == 1) {
    //     setTransactionStatus("Transaction Successful!");
    //     setIsReload(!isReload);
    //     setTimeout(() => {
    //       setTransactionStatus("");
    //     }, 5000);
    //     withdrawStakedTokenRef.current.value = "";
    //   } else {
    //     setTransactionStatus("Transaction Failed!");
    //     setTimeout(() => {
    //       setTransactionStatus("");
    //     }, 5000);
    //   }
    } catch (error) {
      console.error("Token Staking Failed: ", error.message);
    }
  };
  return (
      <form className="withdraw-form" onSubmit={withdrawStakeToken}>
        <label>Amount to Withdraw: </label>
        <input type="text" ref={withdrawStakedTokenRef}></input>
        <Button
          onClick={withdrawStakeToken}
          type="submit"
          label="Withdraw Staked Token"
        />
      </form>
  );
};

export default WithdrawStakeAmount;
