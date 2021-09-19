import Web3 from "web3";

/*================================
    1.  USING MODULES 
================================*/

// const HDWalletProvider = require("truffle-hdwallet-provider");

const HDWalletProvider = require("@truffle/hdwallet-provider");

/*======================================================
    2.  CREATE PROVIDER AND WEB3 INSTANCE 
======================================================*/
/*
    1.  METAMASK MNEMONIC
*/
const mnemonic =
  "surge evidence solid brief frog shed tree crawl laugh coach piano sustain";
/*
    2.  DEFINE PROVIDER
*/
const rinkeby_network =
  "https://rinkeby.infura.io/v3/cda63f8412604c728800fbfa247cde1a";
const provider = new HDWalletProvider(mnemonic, rinkeby_network);
const web3 = new Web3(provider);

export default web3;
