import web3 from "./web3";
import FoodSupplyChain from "../build/contracts/FoodSupplyChain.json";

export default (address) => {
  return new web3.eth.Contract(FoodSupplyChain.abi, address);
};
