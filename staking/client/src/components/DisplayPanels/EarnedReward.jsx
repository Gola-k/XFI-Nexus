import { useState, useEffect, useContext } from "react";
import Web3Context from "../../context/Web3Context";
import { ethers } from "ethers";

const EarnedReward = () => {
    const {stakingContract, account} = useContext(Web3Context);
    const [earnedReward, setEarnedReward] = useState("0");

    useEffect(() => {
        const fetchEarnedReward = async () => {
            try {
                const earnedRewardWei = await stakingContract.earned(account);
                const earnedRewardETH = ethers.formatEther(earnedRewardWei.toString(), 18);
                const roundedRewardValue = parseFloat(earnedRewardETH).toFixed(2);
                console.log(earnedRewardETH);
                setEarnedReward(roundedRewardValue);
            } catch (error) {
                console.error("Error fetching staked balance: ", error);
            }
        }
        stakingContract && fetchEarnedReward()
    }, [stakingContract, account]);

    return (
        <p>Earned Reward: {earnedReward}</p>
    )
}

export default EarnedReward;