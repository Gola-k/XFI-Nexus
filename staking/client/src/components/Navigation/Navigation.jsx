import ConnectedNetwork from "./ConnectedNetwork";
import ConnectedAccount from "./connectedAccount";

const Navigation = () => {
    return (
        <nav>
            <ConnectedAccount />
            <ConnectedNetwork />
        </nav>
    )
}
export default Navigation;