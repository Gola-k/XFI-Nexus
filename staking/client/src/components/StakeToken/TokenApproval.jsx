import { useState, useContext, useRef } from "react";
import Button from "../Button/Button";
import Web3Context from "../../context/Web3Context";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import "./StakeToken.css";

const TokenApproval = () => {
  const { stakeTokenContract, stakingContract } = useContext(Web3Context);
  const approvedTokenRef = useRef();
  const [transactionStatus, setTransactionStatus] = useState("");
  const approveToken = async (e) => {
    e.preventDefault();
    const amount = approvedTokenRef.current.value.trim();
    if (isNaN(amount) || amount <= 0) {
      console.error("Please enter a valid positive number");
      return;
    }
    const amountToSend = ethers.parseUnits(amount, 18).toString();
    console.log(amountToSend);
    try {
      const transaction = await stakeTokenContract.approve(
        stakingContract.target,
        amountToSend
      );
      console.log(transaction);
      await toast.promise(transaction.wait(), {
        loading: "Transaction is pending...",
        success: "Transaction successful 👌",
        error: "Transaction failed 🤯",
      });
      approvedTokenRef.current.value = "";
      setTransactionStatus("Transaction is pending!");
    //   const receipt = await transaction.wait();
    //   if (receipt.status == 1) {
    //     setTransactionStatus("Transaction Successful!");
    //     setTimeout(() => {
    //       setTransactionStatus("");
    //     }, 5000);
    //     approvedTokenRef.current.value = "";
    //   } else {
    //     setTransactionStatus("Transaction Failed!");
    //     setTimeout(() => {
    //       setTransactionStatus("");
    //     }, 5000);
    //   }
    } catch (error) {
      console.error("Token Approval Failed: ", error.message);
    }
  };
  return (
    <div>
      <form onSubmit={approveToken} className="token-amount-form">
        <label className="token-input-label">Token Approval: </label>
        <input type="text" ref={approvedTokenRef}></input>
        <Button onClick={approveToken} type="submit" label="Token Approve" />
      </form>
    </div>
  );
};
export default TokenApproval;
