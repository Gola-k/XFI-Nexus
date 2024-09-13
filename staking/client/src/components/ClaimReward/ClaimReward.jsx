import { useState, useContext, useRef } from "react";
import Button from "../Button/Button";
import Web3Context from "../../context/Web3Context";

import { toast } from "react-hot-toast";
import "./ClaimReward.css";

const ClaimReward = () => {
  const { stakingContract } = useContext(Web3Context);
  const claimReward = async (e) => {
    e.preventDefault();
    try {
      const transaction = await stakingContract.getReward();
      await toast.promise(transaction.wait(), {
        loading: "Transaction is pending...",
        success: "Transaction successful 👌",
        error: "Transaction failed 🤯",
      });
    //   if (receipt.status == 1) {
    //     setTransactionStatus("Transaction Successful!");
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
      console.error("Claim Reward Failed: ", error.message);
    }
  };
  return (
    <div className="claim-reward">
      <Button onClick={claimReward} type="submit" label="Claim Reward" />
    </div>
  );
};

export default ClaimReward;
