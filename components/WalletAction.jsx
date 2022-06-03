import Wallet from '../cardano/wallet';

const WalletAction = () => {
    // const [cookie, setCookie] = useCookies(['wallet']);
    // const [walletConnected, setWalletConnected] = useState(false);
    // const [wallets, setWallets] = useState([]);
  
    // const walletIcons = {
    //   nami: <NamiLogo className="my-2 h-8 w-8 fill-buttonPrimary" />,
    //   eternl: <EternlLogo className="my-1 h-10 w-10 fill-buttonPrimary" />,
    //   gerowallet: <GeroLogo className="my-2 h-8 w-8 fill-buttonPrimary" />,
    // };
  
    const connectWallet = async () => {
      const connected = await Wallet.connect();
      if(connected){

      }
    //   if (connected) {
    //     setWalletConnected(true);
    //     setCookie('wallet', wallet);
    //     Router.push('/account');
    //   }
    };

    const delegateWallet = async () => {
      const connected = await Wallet.delegate();
      if(connected){

      }
    //   if (connected) {
    //     setWalletConnected(true);
    //     setCookie('wallet', wallet);
    //     Router.push('/account');
    //   }
    };
  
    return <div>
          <div onClick={() => connectWallet()}>Connect</div>
          <div onClick={() => delegateWallet()}>Delegate</div>
          </div>;
  };
  
  export default WalletAction;
  