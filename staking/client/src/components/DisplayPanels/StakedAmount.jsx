import { useState, useEffect, useContext } from "react";
import Web3Context from "../../context/Web3Context";
import { ethers } from "ethers";

const StakedAmount = () => {
    const {stakingContract, account} = useContext(Web3Context);
    const [stakedAmount, setStakedAmount] = useState("0");

    useEffect(() => {
        const fetchStakedBalance = async () => {
            try {
                const amountStakedWei = await stakingContract.stakedBalance(account);
                const amountStakedETH = ethers.formatEther(amountStakedWei.toString(), 18);
                setStakedAmount(amountStakedETH);
            } catch (error) {
                console.error("Error fetching staked balance: ", error);
            }
        }
        stakingContract && fetchStakedBalance()
    }, [stakingContract, account]);

    return (
        <p>Staked Amount: {stakedAmount}</p>
    )
}

export default StakedAmount;