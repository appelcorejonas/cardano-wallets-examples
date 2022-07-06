class Loader {
    async load() {
      if (this._wasmx) return;
      /**
       * @private
       */
      this._wasmx = await import(
        '../../node_modules/@emurgo/cardano-serialization-lib-browser'
      );
    }
  
    get Cardano() {
      return this._wasmx;
    }
  }
  
  export default new Loader();
  