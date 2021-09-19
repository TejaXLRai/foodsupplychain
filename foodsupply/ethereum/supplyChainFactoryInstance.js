import web3 from "./web3";
import supplyChainFactory from "../build/contracts/SupplyChainFactory.json";

/*================================
    1.  CREATE FACTORY INSTANCE
================================*/
const factoryContractAccountAddress =
  "0xD303b4D2DF820F9289EC68c2167f331036f8b041"; // get from deploy.js
const supplyChainFactoryInstance = new web3.eth.Contract(
  supplyChainFactory.abi,
  factoryContractAccountAddress
);

// console.log( supplyChainFactoryInstance );
export default supplyChainFactoryInstance;
