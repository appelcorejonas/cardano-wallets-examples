import { CoinSelectionStrategyCIP2 } from '@dcspark/cardano-multiplatform-lib-browser';
import loader from './loader';
import Loader from './loader';

class Wallet {
    async connect(walletName) {

      var instance = null;
      document.getElementById("walletStatus").innerHTML = null;
      document.getElementById("paymentWalletAddress").innerHTML = null;
      document.getElementById("rewardWalletAddress").innerHTML = null;
      document.getElementById("stakeKeyHash").innerHTML = null;
      document.getElementById("walletBalance").innerHTML = null;

      if(walletName == "typhon"){
        instance = await window.cardano?.typhon;
      }

      else if(walletName == "eternl"){
        instance = await window.cardano?.eternl;
      }

      else if(walletName == "nami"){
        instance = await window.cardano?.nami;
      }
        
        if (instance) {
            await Loader.load();
            this._provider = instance;
            this._providerapi = null;
            

            console.log("Provider instance loaded");
            console.log(instance);
            console.log(Loader.Cardano);

            // enable
            const accessEnabled = await this._enable();
            if (!accessEnabled) {
              console.log("Site not whitelisted!");
              document.getElementById("walletStatus").innerHTML = "Site not whitelisted for " + instance.name + " wallet";
              return false;
            }

            console.log("Connection successful!");
            document.getElementById("walletStatus").innerHTML = instance.name +  ": connection successful!";

            document.getElementById("walletImage").src = instance.icon;

            const addressText = await this._getPaymentAddress();
            console.log("Wallet payment address: " + addressText);
            document.getElementById("paymentWalletAddress").innerHTML = addressText;

            const rewardAddressText = await this._getRewardAddress(stakeKeyHashText);
            console.log("Wallet reward address: " + addressText);
            document.getElementById("rewardWalletAddress").innerHTML = rewardAddressText;

            const stakeKeyHashText = await this._getStakeKeyHash(rewardAddressText);
            console.log("Stake key hash: " + stakeKeyHashText);
            document.getElementById("stakeKeyHash").innerHTML = stakeKeyHashText;


            const balance = await this._getBalance();
            console.log("Wallet balance: " + balance);
            document.getElementById("walletBalance").innerHTML = balance + " ADA";

            return true;
        }

        return  false;
    };

    //TODO
    async _getRewardAddress(stakeKey) {
      const provider = this._provider;
      const providerapi = this._providerapi;
      console.log("Get reward address");
      console.log(provider);

      if(provider){
        if(provider.name === "Typhon Wallet"){
          return "";
        }
        else if(provider.name === "eternl"){
          await Loader.load();
          const addressResponse = await this.getFirstRewardAddress();
          console.log(addressResponse);
          const addressBytes = Buffer.from(addressResponse, 'hex');
          const address = Loader.Cardano.Address.from_bytes(addressBytes);
          console.log(address.to_bech32());
          return address.to_bech32();
        } 
        else if(provider.name === "Nami"){
          await Loader.load();
          const addressResponse = await this.getFirstRewardAddress();
          console.log(addressResponse);
          const addressBytes = Buffer.from(addressResponse, 'hex');
          const address = Loader.Cardano.Address.from_bytes(addressBytes);
          console.log(address.to_bech32());
          return address.to_bech32();
        }
      }

      return "Error: No address found";
    };

    async _getStakeKeyHash(stakeKey) {
      await Loader.load();

      console.log(Loader.Cardano);

      const addressResponse = await this.getFirstRewardAddress();
      console.log(addressResponse);
      return addressResponse;
    };
  

    async _getPaymentAddress() {
      const provider = this._provider;
      const providerapi = this._providerapi;
      console.log("Get payment address");
      console.log(provider);

      if(provider){
        if(provider.name === "Typhon Wallet"){
          const addressResponse = await provider.getAddress();
          if (addressResponse.status) {
            return addressResponse.data;
          }
        }
        else if(provider.name === "eternl"){
          await Loader.load();
          const addressResponse = await this.getFirstUsedAddresses();
          console.log(addressResponse);
          const addressBytes = Buffer.from(addressResponse, 'hex');
          const address = Loader.Cardano.Address.from_bytes(addressBytes);
          console.log(address.to_bech32());
          return address.to_bech32();
        } 
        else if(provider.name === "Nami"){
          await Loader.load();
          const addressResponse = await this.getFirstUsedAddresses();
          console.log(addressResponse);
          const addressBytes = Buffer.from(addressResponse, 'hex');
          const address = Loader.Cardano.Address.from_bytes(addressBytes);
          console.log(address.to_bech32());
          return address.to_bech32();
        }
      }

      return "Error: No address found";
    };

    async _getBalance() {
      const provider = this._provider;
      const providerapi = this._providerapi;
      console.log("Get balance");
      console.log(provider);

      if(provider){
        if(provider.name === "Typhon Wallet"){
          const balanceResponse = await provider.getBalance();
          console.log(balanceResponse);
          if (balanceResponse) {
            return balanceResponse.data.ada/1000000;
          }
        }
        else if(provider.name === "eternl"){
          await Loader.load();
          //cbor hex expected 
          const balanceResponse = await providerapi.getBalance(); //TODO: not working!
          console.log(balanceResponse);
          const balance = Loader.Cardano.Value.from_bytes(Buffer.from(balanceResponse, 'hex'));
          const lovelaces = balance.coin().to_str();
          if (lovelaces) {
            return lovelaces/1000000;
          }
        }
        else if(provider.name === "Nami"){
          await Loader.load();
          const balanceResponse = await providerapi.getBalance(); //TODO: not working!
          console.log(balanceResponse);
          const balance = Loader.Cardano.Value.from_bytes(Buffer.from(balanceResponse, 'hex'));
          const lovelaces = balance.coin().to_str();
          if (lovelaces) {
            return lovelaces/1000000;
          }
        }
      }

      return "Error: No balance found";
    };

    async getFirstUsedAddresses() {
      const providerapi = this._providerapi;
      if(!providerapi)
        return "No used address found"; 

      const addresses = await providerapi.getUsedAddresses();
  
      console.log(addresses);

      if(addresses && addresses.length > 0){
        return addresses[0];
      }
      else{
        return "";
      }
    };

    async getFirstRewardAddress() {
      const providerapi = this._providerapi;
      if(!providerapi)
        return "No reward address found"; 

      const addresses = await providerapi.getRewardAddresses();
  
      console.log(addresses);

      if(addresses && addresses.length > 0){
        return addresses[0];
      }
      else{
        return "";
      }
    };

    async _enable() {
        const provider = this._provider;

        if(!provider) return false;

        // check if site is whitelisted
        console.log("Is provider enabled?")
        const isEnabledResponse = await provider.isEnabled();
        console.log(isEnabledResponse);
        if(isEnabledResponse){
          if (isEnabledResponse.data){
            return true; //Typhon
          }
        }
  
        //Request user to whitelist and get api. If already whilelisted, just get api.
        console.log("Enabled provider")
        const enableResponse = await provider.enable();
        console.log(enableResponse);
        if (enableResponse) {
          this._providerapi = enableResponse;
          return true;
        }
  
        return false;
    };

    async delegate() {
        await Loader.load();
        const provider = this._provider;

        if(!provider){
          console.log("You have to connect first!");
          document.getElementById("walletStatus").innerHTML = "Wallet not connected!";
          return false;
        } 

        if (!provider) {
          console.log("Wallet Extension not installed!");
          document.getElementById("walletStatus").innerHTML = "Wallet Extension not installed!";
          return;
        }
  
        // enable
        const accessEnabled = await this._enable();
        if (!accessEnabled) {
          console.log("Site not whitelisted!");
          document.getElementById("walletStatus").innerHTML = "Site not whitelisted!";
          return;
        }
  
        const poolId = "pool1ps2yl6axlh5uzzst99xzkk7x0fhlmr7x033j7cmmm82x2a9n8lj"; //UNI1
  
        //delegate
        console.log("Try delegate " + provider.name);
        if(provider.name === "Typhon Wallet"){
          console.log("Delegating " + provider.name);
          const delegateResponse =
          await provider.delegationTransaction({
            poolId: poolId,
          });
  
          if (delegateResponse.status) {
            document.getElementById("delagateTransactionId").innerHTML =
              delegateResponse.data.transactionId;
          } else {
            console.log("delegateResponse: ", delegateResponse);
            document.getElementById("delagateStatus").innerHTML = delegateResponse.error;
          }
        }
        else if(provider.name === "eternl"){
          console.log("TODO Delegating " + provider.name);
          document.getElementById("delagateStatus").innerHTML = "TODO - Delegate with Eternl";
        }
        else if(provider.name === "Nami"){
          console.log("TODO Delegating " + provider.name);
          await this.initDelegation();
          document.getElementById("delagateStatus").innerHTML = "TODO - Delegate with Nami";
        }
    };

    async initDelegation() {
      setData({
        fee: '',
        stakeRegistration: '',
        rewards: '',
        ready: false,
        error: '',
      });
      const protocolParameters = await initTx();
      const checkTx = async (count) => {
        if (count >= 5) {
          setData((d) => ({
            ...d,
            error: 'Transaction not possible (maybe insufficient balance)',
          }));
          throw ERROR.txNotPossible;
        }
        try {
          const tx = await this.delegationTx(
            account,
            delegation,
            protocolParameters
          );
          setData({
            fee: tx.body().fee().to_str(),
            tx,
            account,
            stakeRegistration:
              !delegation.active && protocolParameters.keyDeposit,
            ready: true,
          });
        } catch (e) {
          checkTx(count + 1);
        }
      };
      checkTx(0);
    };

    async blockfrostRequest(endpoint, headers, body, signal) {
      const network = await getNetwork();
      let result;
    
      while (!result || result.status_code === 500) {
        if (result) {
          await delay(100);
        }
        const rawResult = await fetch(provider.api.base(network.node) + endpoint, {
          headers: {
            ...provider.api.key(network.id),
            ...provider.api.header,
            ...headers,
            'Cache-Control': 'no-cache',
          },
          method: body ? 'POST' : 'GET',
          body,
          signal,
        });
        result = await rawResult.json();
      }
    
      return result;
    };

    async initTx () {
      const latest_block = await blockfrostRequest('/blocks/latest');
      const p = await blockfrostRequest(`/epochs/${latest_block.epoch}/parameters`);
    
      return {
        linearFee: {
          minFeeA: p.min_fee_a.toString(),
          minFeeB: p.min_fee_b.toString(),
        },
        minUtxo: '1000000', //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
        poolDeposit: p.pool_deposit,
        keyDeposit: p.key_deposit,
        coinsPerUtxoWord: p.coins_per_utxo_word,
        maxValSize: p.max_val_size,
        priceMem: p.price_mem,
        priceStep: p.price_step,
        maxTxSize: parseInt(p.max_tx_size),
        slot: parseInt(latest_block.slot),
      };
    };

    async signAndSubmit (
      tx,
      { keyHashes, accountIndex },
      password
      ) {
      await Loader.load();
      const witnessSet = await signTx(
        Buffer.from(tx.to_bytes(), 'hex').toString('hex'),
        keyHashes,
        password,
        accountIndex
      );
      const transaction = Loader.Cardano.Transaction.new(
        tx.body(),
        witnessSet,
        tx.auxiliary_data()
      );

      const txHash = await submitTx(
        Buffer.from(transaction.to_bytes(), 'hex').toString('hex')
      );
      return txHash;
    };

    async signAndSubmitHW (
      tx,
      { keyHashes, account, hw, partialSign }
    ) {
      await Loader.load();

      const witnessSet = await signTxHW(
        Buffer.from(tx.to_bytes(), 'hex').toString('hex'),
        keyHashes,
        account,
        hw,
        partialSign
      );

      const transaction = Loader.Cardano.Transaction.new(
        tx.body(),
        witnessSet,
        tx.auxiliary_data()
      );

      try {
        const txHash = await submitTx(
          Buffer.from(transaction.to_bytes(), 'hex').toString('hex')
        );
        return txHash;
      } catch (e) {
        throw ERROR.submit;
      }
    };

    async getDelegation () {
      const rewardAddr = await this.GetRewardAddr();

      const currentAccount = await getCurrentAccount();
      const stake = await blockfrostRequest(
        `/accounts/${rewardAddr}`
      );
      if (!stake || stake.error || !stake.pool_id) return {};
      const delegation = await blockfrostRequest(
        `/pools/${stake.pool_id}/metadata`
      );
      if (!delegation || delegation.error) return {};
      return {
        active: stake.active,
        rewards: stake.withdrawable_amount,
        homepage: delegation.homepage,
        poolId: stake.pool_id,
        ticker: delegation.ticker,
        description: delegation.description,
        name: delegation.name,
      };
    };

    async delegationTx (protocolParameters) {
      const provider = this._provider;
      const delegation = await this.getDelegation();

      const paymentAddr = await this.getAddress();
      const stakeKeyHash = await this.getStakeKey();
      //--
      const utxos = await getUtxos();
    
      const outputs = Loader.Cardano.TransactionOutputs.new();
      outputs.add(
        Loader.Cardano.TransactionOutput.new(
          Loader.Cardano.Address.from_bech32(paymentAddr),
          Loader.Cardano.Value.new(
            Loader.Cardano.BigNum.from_str(protocolParameters.keyDeposit)
          )
        )
      );
      CoinSelection.setProtocolParameters(
        protocolParameters.coinsPerUtxoWord,
        protocolParameters.linearFee.minFeeA,
        protocolParameters.linearFee.minFeeB,
        protocolParameters.maxTxSize.toString()
      );
      const selection = await CoinSelection.randomImprove(utxos, outputs, 20);
    
      const inputs = selection.input;
      const txBuilderConfig = Loader.Cardano.TransactionBuilderConfigBuilder.new()
        .coins_per_utxo_word(
          Loader.Cardano.BigNum.from_str(protocolParameters.coinsPerUtxoWord)
        )
        .fee_algo(
          Loader.Cardano.LinearFee.new(
            Loader.Cardano.BigNum.from_str(protocolParameters.linearFee.minFeeA),
            Loader.Cardano.BigNum.from_str(protocolParameters.linearFee.minFeeB)
          )
        )
        .key_deposit(Loader.Cardano.BigNum.from_str(protocolParameters.keyDeposit))
        .pool_deposit(
          Loader.Cardano.BigNum.from_str(protocolParameters.poolDeposit)
        )
        .max_tx_size(protocolParameters.maxTxSize)
        .max_value_size(protocolParameters.maxValSize)
        .prefer_pure_change(true)
        .build();
    
      const txBuilder = Loader.Cardano.TransactionBuilder.new(txBuilderConfig);
      for (let i = 0; i < inputs.length; i++) {
        const utxo = inputs[i];
        txBuilder.add_input(
          utxo.output().address(),
          utxo.input(),
          utxo.output().amount()
        );
      }
    
      const certificates = Loader.Cardano.Certificates.new();
      if (!delegation.active)
        certificates.add(
          Loader.Cardano.Certificate.new_stake_registration(
            Loader.Cardano.StakeRegistration.new(
              Loader.Cardano.StakeCredential.from_keyhash(
                Loader.Cardano.Ed25519KeyHash.from_bytes(
                  Buffer.from(stakeKeyHash, 'hex')
                )
              )
            )
          )
        );
      const poolKeyHash =
        '0c144feba6fde9c10a0b294c2b5bc67a6ffd8fc67c632f637bd9d465'; //UNI1
      certificates.add(
        Loader.Cardano.Certificate.new_stake_delegation(
          Loader.Cardano.StakeDelegation.new(
            Loader.Cardano.StakeCredential.from_keyhash(
              Loader.Cardano.Ed25519KeyHash.from_bytes(
                Buffer.from(stakeKeyHash, 'hex')
              )
            ),
            Loader.Cardano.Ed25519KeyHash.from_bytes(
              Buffer.from(poolKeyHash, 'hex')
            )
          )
        )
      );
      txBuilder.set_certs(certificates);
    
      txBuilder.set_ttl(protocolParameters.slot + TX.invalid_hereafter);
      txBuilder.add_change_if_needed(
        Loader.Cardano.Address.from_bech32(paymentAddr)
      );
    
      const transaction = Loader.Cardano.Transaction.new(
        txBuilder.build(),
        Loader.Cardano.TransactionWitnessSet.new()
      );
    
      return transaction;
    };
}

export default new Wallet();