import Wallet from '../cardano/wallet';

const WalletAction = () => {
    const connectWallet = async (walletName) => {
      const connected = await Wallet.connect(walletName);
      if(connected){

      }
    };

    const delegateWallet = async () => {
      const connected = await Wallet.delegate();
      if(connected){

      }
    };
  
    return <div>
          <div onClick={() => connectWallet("typhon")}>Connect Typhon Wallet</div>
          <div onClick={() => connectWallet("eternl")}>Connect Eternl Wallet</div>
          <div onClick={() => connectWallet("nami")}>Connect Nami Wallet</div>
          <div onClick={() => delegateWallet()}>Delegate</div>
          </div>;
  };
  
  export default WalletAction;
  