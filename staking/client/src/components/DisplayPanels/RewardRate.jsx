import { useState, useEffect, useContext } from "react";
import Web3Context from "../../context/Web3Context";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import "./DisplayPanel.css";

const RewardRate = () => {
    const {stakingContract, account} = useContext(Web3Context);
    const [rewardRate, setRewardrate] = useState("0");

    useEffect(() => {
        const fetchRewardRate = async () => {
            try {
                const rewardRateWei = await stakingContract.REWARD_RATE();
                const rewardRateETH = ethers.formatEther(rewardRateWei.toString(), 18);
                setRewardrate(rewardRateETH);
                console.log(rewardRateETH);
            } catch (error) {
                toast.error("Error fetching reward rate");
                console.error("Error fetching  reward rate", error);
            }
        }
        stakingContract && fetchRewardRate()
    }, [stakingContract, account]);

    return (
        <div className="reward-rate">
            <p>Reward Rate:</p>
            <span>{rewardRate} token/sec </span>
        </div>
    )
}

export default RewardRate;