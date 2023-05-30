import "./index.scss";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";

const Header = () => {
  const { connected, metaState, network, chainId, balance, walletConnect } = useMetamaskProvider();

  return (
    <div className="d-flex justify-content-center">
      {connected &&
        <div>
          <h3>Wallet Connected</h3>
          <h4>Address: {metaState.account}</h4>
          <h4>chain Name: {network}</h4>
          <h4>chain Id: {chainId}</h4>
          <h4>balance: {balance}</h4>
        </div>
      }
      {!connected &&
        <button onClick={() => { walletConnect() }}>Connect Wallet</button>
      }
    </div>
  );
};

export default Header;
