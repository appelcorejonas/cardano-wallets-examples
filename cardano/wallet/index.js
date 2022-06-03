import Cardano from '@dcspark/cardano-multiplatform-lib-browser'

class Wallet {
    async connect(walletName) {

      var instance = null;
      document.getElementById("walletAddress").innerHTML = null;

      if(walletName == "typhon"){
        instance = await window.cardano?.typhon;
      }

      else if(walletName == "nami"){
        instance = await window.cardano?.nami;
      }
        
        if (instance) {
            this._provider = instance;

            // enable
            const accessEnabled = await this._enable();
            if (!accessEnabled) {
              console.log("Site not whitelisted!");
              document.getElementById("walletStatus").innerHTML = "Site not whitelisted for " + instance.name + " wallet";
              return false;
            }

            console.log("Connection successful!");
            document.getElementById("walletStatus").innerHTML = instance.name +  " wallet connection successful!";
            const addressResponse = await window.cardano.typhon.getAddress();
            if (addressResponse.status) {
              console.log("Wallet address: " + addressResponse.data);
              document.getElementById("walletAddress").innerHTML = addressResponse.data;
            }
            return true;
        }

        return  false;
    };

    async _enable() {
        const provider = this._provider;

        if(!provider) return false;

        // check if site is whitelisted
        const isEnabledResponse = await provider.isEnabled();

        if(isEnabledResponse){
          console.log(isEnabledResponse);
          if (isEnabledResponse.data){
            return true; //Typhon
          }
          else if (isEnabledResponse === true){
            return true; //Nami
          }
        }
  
        // Site not white listed, Request user to whitelist
        const enableResponse = await provider.enable();
  
        if (enableResponse.status) {
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
        else if(provider.name === "Nami"){
          console.log("Delegating " + provider.name);
        }
      
    };
}

export default new Wallet();