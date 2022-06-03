import Cardano from '@dcspark/cardano-multiplatform-lib-browser'

class Wallet {
    async connect() {
        const instance = await window.cardano?.typhon;
        if (instance) {
            this._provider = instance;

            // enable
            const accessEnabled = await this._enable();
            if (!accessEnabled) {
              console.log("Site not whitelisted!");
              document.getElementById("walletStatus").innerHTML = "Site not whitelisted!";
              return false;
            }

            console.log("Connection successful!");
            document.getElementById("walletStatus").innerHTML = "Wallet connection successful!";
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
        if (isEnabledResponse.data) return true;
  
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
    };
}

export default new Wallet();