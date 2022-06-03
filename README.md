You need: 
-Visual studio code
-Nextjs
-yarn


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



