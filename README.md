This is a simple "get started" example with Nextjs, of how to connect to a Cardano wallet and then delegate your wallet to a stakepool.
The stakepool ID is hard coded into cardano\wallet\index.js

I found all info to do this here:
https://github.com/dcSpark/cardano-multiplatform-lib
https://github.com/StricaHQ/examples-dapp-connector/blob/master/transactions/delegation.html
Not implemented yet: https://github.com/Berry-Pool/nami-wallet/



You need: 
-Visual studio code
-Nextjs
-yarn
-Typhon wallet browser extension (https://typhonwallet.io/#/download)


To start this example project:

yarn install

yarn dev

Then navigate to http://localhost:3000/




If you want to start from scratch: run the following in VisualStudio terminal:

yarn create next-app –typescript
yarn add  @dcspark/cardano-multiplatform-lib-browser
yarn install

To get the cardano-multiplatform-lib to work add the following to next.config.js:

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };
    return config;
  },
}
module.exports = nextConfig

Done!



