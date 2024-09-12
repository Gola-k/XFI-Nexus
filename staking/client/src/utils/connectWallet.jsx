import { Contract, ethers } from "ethers";
import stakingAbi from "../ABI/stakingAbi.json";
import stakeTokenAbi from "../ABI/stakeTokenAbi.json";

export const connectWallet = async () => {
  try {
    let [
      signer,
      provider,
      account,
      stakingContract,
      stakeTokenContract,
      chainId,
    ] = [null];
    
    if(window.ethereum==null){
        throw new Error("No wallet detected");
    }

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    let chainIdHex = await window.ethereum.request({
        method: "eth_chainId"
    });

    chainId = parseInt(chainIdHex, 16);

    let selectedAccount = accounts[0]; 
    if(!selectedAccount) {
        throw new Error("No account found");
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    const stakingContractAddress = "0x7ebAE8426C015b23659BEa41949fA7F6AA95A714";
    const stakeTokenContractAddress = "0x47E5B5BCd5727cBB0C136E728282EfA27Ad8aC98";

    stakingContract = new Contract(stakingContractAddress, stakingAbi, signer);
    stakeTokenContract = new Contract(stakeTokenContractAddress, stakeTokenAbi, signer);

    return {provider, selectedAccount, stakingContract, stakeTokenContract, chainId};

  } catch (error) {
    console.error(error);
    throw error;
  }
};
