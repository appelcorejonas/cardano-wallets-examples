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
            this._provider = instance;
            this._providerapi = null;

            console.log("Provider instance loaded");
            console.log(instance);

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
          // const addressResponse = await this.getFirstUsedAddresses();
          // console.log(addressResponse);
          // return addressResponse;
          return "TODO eternl address";
        }
        else if(provider.name === "Nami"){
          // const addressResponse = await this.getFirstUsedAddresses();
          // console.log(addressResponse);
          // return addressResponse;
          return "TODO Nami address";
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
          //cbor hex expected 
          const balanceResponse = await providerapi.getBalance(); //TODO: not working!
          console.log(balanceResponse);
          if (balanceResponse) {
            return balanceResponse;
          }
        }
        else if(provider.name === "Nami"){
          const balanceResponse = await providerapi.getBalance(); //TODO: not working!
          console.log(balanceResponse);
          if (balanceResponse) {
            return balanceResponse;
          }
        }
      }

      return "Error: No balance found";
    };

    async getFirstUsedAddresses() {
      const providerapi = this._providerapi;
      if(!providerapi)
        return "No address found"; 

      const usedAddresses = await providerapi.getUsedAddresses();
  
      console.log(usedAddresses);

      console.log(window.cardano);

      return usedAddresses.map(address =>
        window.cardano.Address.from_bytes(Buffer.from(address, "hex")).to_bech32()
      )[0];
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
  
        const poolId = "pool1ykwcqf7r8mj9fmprr9f3y62ftsrlalxm22j383gfpav76ddrc25";
  
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
}

export default new Wallet();