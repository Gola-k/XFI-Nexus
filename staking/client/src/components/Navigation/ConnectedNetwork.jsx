import { useContext } from "react";
import Web3Context from "../../context/Web3Context";
const ConnectedNetwork = () => {
    const {chainId} = useContext(Web3Context);
    if (chainId == 11155111){
        return (
            <p>Connected Network: Sepolia</p>
        )
    }
    else {
        return (
            <p>Connected Network: Unsupported Network. Switch to Sepolia</p>
        )
    }
}
export default ConnectedNetwork;