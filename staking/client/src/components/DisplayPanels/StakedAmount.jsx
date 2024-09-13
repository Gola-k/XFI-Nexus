import { useState, useEffect, useContext } from "react";
import Web3Context from "../../context/Web3Context";
import StakingContext from "../../context/StakingContext";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import "./DisplayPanel.css";

const StakedAmount = () => {
    const {stakingContract, account} = useContext(Web3Context);
    const {isReload} = useContext(StakingContext);
    const [stakedAmount, setStakedAmount] = useState("0");

    useEffect(() => {
        const fetchStakedBalance = async () => {
            try {
                const amountStakedWei = await stakingContract.stakedBalance(account);
                const amountStakedETH = ethers.formatEther(amountStakedWei.toString(), 18);
                setStakedAmount(amountStakedETH);
            } catch (error) {
                toast.error("Error fetching staked amount");
                console.error(error.message)
            }
        }
        stakingContract && fetchStakedBalance()
    }, [stakingContract, account, isReload]);

    return (
        <div className="staked-amount">
            <p>Staked Amount: </p> <span>{stakedAmount}</span>
        </div>
    )
}

export default StakedAmount;