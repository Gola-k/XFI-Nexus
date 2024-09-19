import { useState } from "react";
import { useAccount } from "wagmi"
import "./sendborrow.css";

const LendBorrow = () => {
  const [action, setAction] = useState("lend");
  const [amount, setAmount] = useState("");

  const { isDisconnected } = useAccount()

  const handleAction = () => {
    if (action === "lend") {
      // Implement lending logic here
      console.log(`Lending ${amount} xXFI`);
    } else {
      // Implement borrowing logic here
      console.log(`Borrowing ${amount} xXFI`);
    }
  };

  return (
    <div className="lend-borrow">
      <h2>{action === "lend" ? "Lend xXFI" : "Borrow xXFI"}</h2>

      <div className="buttons-main-deic">
        <button style={{ padding: "2px" }}>Buy token</button>
        <button>Swap</button>
        <button>Remove Liquidity</button>
        <button>Add Liquidity</button>
      </div>
      <div className="caon-box-mai-dfg">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="in-sjdb-dsfbfj"
        />
        <button onClick={handleAction} disabled={isDisconnected} className="token-button">Send</button>
      </div>
    </div>
  );
};

export default LendBorrow;
