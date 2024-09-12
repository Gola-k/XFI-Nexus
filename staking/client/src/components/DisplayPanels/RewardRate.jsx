import { useState, useEffect, useContext } from "react";
import Web3Context from "../../context/Web3Context";
import { ethers } from "ethers";

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
                console.error("Error fetching staked balance: ", error);
            }
        }
        stakingContract && fetchRewardRate()
    }, [stakingContract, account]);

    return (
        <p>Reward Rate: {rewardRate} token/second</p>
    )
}

export default RewardRate;