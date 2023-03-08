import React, { createContext, useEffect } from "react";
import { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
const { Framework } = require("@superfluid-finance/sdk-core");
const MoneyRouterABI = require("./MoneyRouter.json").abi;
const { key, collectionId, PK } = require("./config.js");
const { Revise } = require("revise-sdk");
const revise = new Revise({ auth: key });
const PushAPI = require("@pushprotocol/restapi");
const etherss = require("ethers");
const Pkey = `0x${PK}`;
const receiveraddress = "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b";
const nft_id = "73544e46-d67f-4268-ac13-daeecd97d5e1";
export const SuperfluidContext = React.createContext();

export const SuperfluidProvider = ({ children }) => {
  const [notifaddress, setNotifaddress] = useState("");

  let receiveradd = "";
  let currentaddress = "";
  let initflowrate = 0;
  let initattribute = 0;
  let lastdura = 0;
  const sendNotification = async (address, title, body) => {
    const signer = new etherss.Wallet(Pkey);

    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: `${title}`,
          body: `${body}`,
        },
        payload: {
          title: `${title}`,
          body: `${body}`,
          cta: "",
          img: "",
        },
        recipients: `eip155:5:${address}`, // recipient address
        channel: "eip155:5:0xd8515Ee7b256C3c0Ba9465fCDC45599437d5826A", // your channel address
        env: "staging",
      });

      // apiResponse?.status === 204, if sent successfully!
      // console.log("API repsonse: ", apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  async function streamstart(rate, recaddress) {
    const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    let signers = await provider.getSigner();

    const sf = await Framework.create({
      chainId: (await provider.getNetwork()).chainId,
      provider,
    });

    const moneyRouter = new ethers.Contract(
      moneyRouterAddress,
      MoneyRouterABI,
      provider
    );

    const daix = await sf.loadSuperToken("fDAIx");
    console.log("daix", daix);

    await moneyRouter
      .connect(signers)
      .createFlowFromContract(daix.address, recaddress, rate, {
        gasLimit: 5000000,
      })
      .then(function (tx) {
        console.log(`
          Congrats! You just successfully created a flow from the money router contract.
          Tx Hash: ${tx.hash}
      `);
      });

    await moneyRouter
      .connect(signers)
      .createFlowIntoContract(daix.address, rate, { gasLimit: 5000000 })
      .then(function (tx) {
        console.log(`
         Congrats! You just successfully created a flow into the money router contract.
         Tx Hash: ${tx.hash}
      `);
      });
  }

  async function streamupdate(rate, recaddress) {
    const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    let signers = await provider.getSigner();

    const sf = await Framework.create({
      chainId: (await provider.getNetwork()).chainId,
      provider,
    });
    const moneyRouter = new ethers.Contract(
      moneyRouterAddress,
      MoneyRouterABI,
      provider
    );

    const daix = await sf.loadSuperToken("fDAIx");
    // console.log("daix", daix);

    await moneyRouter
      .connect(signers)
      .updateFlowFromContract(daix.address, recaddress, rate, {
        gasLimit: 5000000,
      })
      .then(function (tx) {
        console.log(`
          Congrats! You just successfully updated a flow from the money router contract. 
          Tx Hash: ${tx.hash}
      `);
      });

    await moneyRouter
      .connect(signers)
      .updateFlowIntoContract(daix.address, rate, { gasLimit: 5000000 })
      .then(function (tx) {
        console.log(`
        Congrats! You just successfully updated a flow into the money router contract. 
        Tx Hash: ${tx.hash}
      `);
      });
  }

  async function streamdelete(recaddress) {
    const moneyRouterAddress = "0x6cE360db8Cb15d3D963608A0675CF67862311043";

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    let signers = await provider.getSigner();

    const sf = await Framework.create({
      chainId: (await provider.getNetwork()).chainId,
      provider,
    });

    const moneyRouter = new ethers.Contract(
      moneyRouterAddress,
      MoneyRouterABI,
      provider
    );

    const daix = await sf.loadSuperToken("fDAIx");
    // console.log("daix", daix);

    // call money router delete flow into contract method from signers[0]
    //   this flow rate is ~1000 tokens/month
    await moneyRouter
      .connect(signers)
      .deleteFlowFromContract(daix.address, recaddress, { gasLimit: 5000000 })
      .then(function (tx) {
        console.log(`
          Congrats! You just successfully deleted a flow from the money router contract. 
          Tx Hash: ${tx.hash}
      `);
      });

    // call money router delete flow into contract method from signers[0]
    // this flow rate is ~2000 tokens/month
    await moneyRouter
      .connect(signers)
      .deleteFlowIntoContract(daix.address, { gasLimit: 5000000 })
      .then(function (tx) {
        console.log(`
          Congrats! You just successfully delete a flow that was being sent into the money router contract. 
          Tx Hash: ${tx.hash}
      `);
      });
  }

  const updateflowrate = (initdura, currdura, currflowrate, type) => {
    // console.log(initdura, currdura, currflowrate, type);

    switch (type) {
      case "constant":
        return currflowrate;
        break;
      case "logarithmic":
        let newflowrate1 = currflowrate * Math.log(initdura - currdura);
        return newflowrate1;
        break;
      case "linear":
        // console.log("inside linear");
        let newflowrate2 = currflowrate * (initdura - currdura);
        // console.log("new", newflowrate2);
        return newflowrate2;
        break;
      case "exponential":
        let newflowrate3 = currflowrate * Math.exp(initdura - currdura);
        return newflowrate3;
        break;
      default:
        return currflowrate;
        break;
    }
  };

  async function API() {
    let revisions = await revise.fetchRevisions(nft_id);
    let dura1 = parseInt(revisions?.revisions[0]?.metaData[1]?.durablity);
    let dura2 = parseInt(revisions?.revisions[1]?.metaData[1]?.durablity);
    let initdura = parseInt(initattribute);

    // console.log(initattribute, initflowrate, receiveradd);
    // console.log("fduuuuuuuuudf", dura1, dura2, initdura, lastdura);

    // console.log("dura1 npt equal last", dura1 !== lastdura);
    // console.log("dura1 less than dura2", dura1 < dura2);
    // console.log("dura2 less than initdura", dura2 < initdura);

    if (dura1 < dura2 && dura2 < initdura && dura1 !== lastdura) {
      console.log("durablity is reduced : updating streame");
      lastdura = dura1;
      let newflowrate = updateflowrate(initdura, dura1, initflowrate, "linear");
      console.log("new flow rate", newflowrate);
      streamupdate(newflowrate.toString(), receiveradd);
      sendNotification(
        currentaddress,
        "flowrate updated",
        `flowrate is updated to ${newflowrate / 1000000} Gwei/sec`
      );
    } else if (dura1 < dura2 && dura2 == initdura && dura1 !== lastdura) {
      console.log("durablity is reduced for the first time : starting streame");
      lastdura = dura1;
      streamstart(initflowrate.toString(), receiveradd);
      sendNotification(
        currentaddress,
        "stream started",
        `flowrate is currently ${initflowrate / 1000000} Gwei/sec`
      );
    } else {
      console.log("durablity is constant : not updating streame");
    }
    return null;
  }

  async function run() {
    const collection = await revise.addCollection({
      name: "Rental Asset",
      uri: "rentalasset",
    });
    console.log("Collection created", collection);
  }

  async function add() {
    const res = await revise.addNFT(
      {
        name: "rare sword 3",
        tokenId: "1",
        description:
          "A sword that is very rare and can be used to kill monsters",
        image: "https://i.ibb.co/ykZfv37/6000-2-05.jpg",
      },
      [{ damage: 200 }, { durablity: 100 }, { attack_speed: 50 }],
      collectionId
    );

    console.log(res);
  }

  async function update(
    initflowratee,
    initattributee,
    receiveraddresss,
    currentaddresss
  ) {
    const res = await revise.fetchNFT("73544e46-d67f-4268-ac13-daeecd97d5e1");

    initattribute = initattributee;
    initflowrate = initflowratee * 1000000;
    receiveradd = receiveraddresss.toString();
    currentaddress = currentaddresss.toString();
    lastdura = parseInt(initattribute);

    const nft = revise.nft(res);
    setTimeout(() => {
      revise
        .every("10s")
        .listenTo(API)
        .start(async (data) => {
          console.log("data");
        });
    }, 1000);
  }

  return (
    <SuperfluidContext.Provider
      value={{
        sendNotification,
        streamstart,
        streamupdate,
        streamdelete,
        updateflowrate,
        API,
        run,
        add,
        update,
        notifaddress,
        setNotifaddress,
      }}
    >
      {children}
    </SuperfluidContext.Provider>
  );
};
