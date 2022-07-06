import { CoinSelectionStrategyCIP2 } from '@dcspark/cardano-multiplatform-lib-browser';
import Loader from './loader';

class Wallet {
    async connect(walletName) {

      var instance = null;
      document.getElementById("walletAddress").innerHTML = null;

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

            const addressText = await this._getAddress();
            console.log("Wallet address: " + addressText);
            document.getElementById("walletAddress").innerHTML = addressText;

            const balance = await this._getBalance();
            console.log("Wallet balance: " + balance);
            document.getElementById("walletBalance").innerHTML = balance + " ADA";

            return true;
        }

        return  false;
    };

    async _getAddress() {
      const provider = this._provider;
      const providerapi = this._providerapi;
      console.log("Get address");
      console.log(provider);

      if(provider){
        if(provider.name === "Typhon Wallet"){
          const addressResponse = await provider.getAddress();
          if (addressResponse.status) {
            return addressResponse.data;
          }
        }
        else if(provider.name === "eternl"){
          Loader.load();
          const addressResponse = await this.getFirstUsedAddresses();
          console.log(addressResponse);
          const addressBytes = Buffer.from(addressResponse, 'hex');
          const address = Loader.Cardano.Address.from_bytes(addressBytes);
          console.log(address.to_bech32());
          return address.to_bech32();
        } 
        else if(provider.name === "Nami"){
          Loader.load();
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
          Loader.load();
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
          Loader.load();
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
      await Loader.load();

      const providerapi = this._providerapi;
      if(!providerapi)
        return "No address found"; 

      const usedAddresses = await providerapi.getUsedAddresses();
  
      console.log(usedAddresses);

      if(usedAddresses && usedAddresses.length > 0){
        return usedAddresses[0];
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
          document.getElementById("delagateStatus").innerHTML = "TODO - Delegate with Nami";
        }
    };

    async delegationTx (account, delegation, protocolParameters) {
      const provider = this._provider;

      //--
      const utxos = await getUtxos();
    
      const outputs = Loader.Cardano.TransactionOutputs.new();
      outputs.add(
        Loader.Cardano.TransactionOutput.new(
          Loader.Cardano.Address.from_bech32(account.paymentAddr),
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
                  Buffer.from(account.stakeKeyHash, 'hex')
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
                Buffer.from(account.stakeKeyHash, 'hex')
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
        Loader.Cardano.Address.from_bech32(account.paymentAddr)
      );
    
      const transaction = Loader.Cardano.Transaction.new(
        txBuilder.build(),
        Loader.Cardano.TransactionWitnessSet.new()
      );
    
      return transaction;
    };
}

export default new Wallet();