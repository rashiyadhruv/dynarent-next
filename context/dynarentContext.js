import React, { createContext, useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import ContractJson from "./dynarentJson.json";

const abi = ContractJson.abi;
const CONTRACT_ADDRESS = "0x70AFe92485CCa57e8FAb0ad667aC6cE627886D0b";
const MORALIS_API_KEY =
  "ea7RIctgYCrticyh409mE0xSQi8nby1hsbLkL4zfopadb6ett7i6mPTDfAeHRSRD";

export const DynarentContext = React.createContext();

export const DynarentProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [modal, setModal] = useState(false);
  const [cardId, setCardId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [myRentedNfts, setMyRentedNfts] = useState([]);
  const [marketplaceNfts, setMarketplaceNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [selectedBtn, setSelectedBtn] = useState("");
  const [image, setImage] = useState("");
  const [apiResult, setApiResult] = useState("");
  const [rentedNfts, setRentedNfts] = useState([]);

  const [nftHash, setNftHash] = useState("");
  const [nftAddress, setNftAddress] = useState("");
  const [nftId, setNftId] = useState("");
  const [nftName, setNftName] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [nftPrice, setNftPrice] = useState("");
  const [nftDuration, setNftDuration] = useState("");
  const [nftChainName, setNftChainName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftAttributes, setNftAttributes] = useState([]);
  useEffect(() => {
    try {
      // console.log("checking wallet!!!!!!!!!!!!!!!!!!!!!!!");
      // checkIfWalletIsConnect();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchNfts = async (address) => {
    // console.log("fetching nfts");
    try {
      await Moralis.start({
        apiKey: MORALIS_API_KEY,
        // ...and any other configuration
      });
    } catch (error) {
      console.log(error);
    }
    const allNFTs = [];
    const chains = [EvmChain.GOERLI, EvmChain.MUMBAI];

    for (const chain of chains) {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });
      let item;
      // console.log(response.result);

      response.result.map((nft) => {
        item = {
          tokenHash: nft._data.tokenHash,
          tokenAddress: nft._data.tokenAddress._value,
          tokenId: nft._data.tokenId,
          tokenName: nft._data.name,
          tokenUri: nft._data.tokenUri,
          ownerOf: nft._data.ownerOf._value,
          chain: nft._data.chain._chainlistData.chain,
          chainName: nft._data.chain._chainlistData.name,
        };
        allNFTs.push(item);
        return null;
      });

      allNFTs.push(response);
    }

    // console.log(allNFTs);
    setMyNfts(allNFTs);
    return allNFTs;
  };

  const listToMarketplace = async (
    _nftHash,
    _nftAddress,
    _nftId,
    _nftName,
    _tokenUri,
    _flowrate,
    _typeofincrease,
    _attribute,
    _nftChainName
  ) => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      // const web3Provider = await new ethers.BrowserProvider(window.ethereum);
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      // console.log(signer);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      // console.log(contract);
      const txRes = await contract.listToMarketplace(
        _nftHash,
        _nftAddress,
        _nftId,
        _nftName,
        _tokenUri,
        _flowrate,
        _typeofincrease,
        _attribute,
        _nftChainName,
        {
          gasLimit: 5000000,
        }
      );

      setLoading(true);
      await txRes.wait(1);
      setLoading(false);
      // console.log(txRes);
    }
  };

  const rent = async (_nftHash, _renter) => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      // console.log("calling", contract, _nftHash, _renter);
      const txRes = await contract.rent(_nftHash, _renter, {
        gasLimit: 5000000,
      });
      // console.log("feeeeeeeeee", txRes);
      setLoading(true);
      await txRes.wait(1);
      // console.log("feeeeeeeeee", txRes);
      setLoading(false);

      console.log(txRes);
    }
  };

  const returnNft = async (_nftHash, _renter) => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const txRes = await contract.returnNft(_nftHash, _renter, {
        gasLimit: 5000000,
      });
      // console.log("asssssssssssss", txRes);
      setLoading(true);
      await txRes.wait(1);
      setLoading(false);
      // console.log(txRes);
    }
  };

  const getMarketplaceNfts = async () => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      // console.log(contract);

      const txRes = await contract.getMarketplaceNfts();

      // console.log(txRes);
      setMarketplaceNfts(txRes);

      return txRes;
    }
  };

  const getMyRentedNfts = async (_renter) => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      // console.log("weee", _renter);
      const txRes = await contract.getMyRentedNfts(_renter);
      // console.log("deeeeeee", txRes);

      setRentedNfts(txRes);
      return txRes;
    }
  };

  const getNftDetailsByHash = async (_nftHash) => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      const txRes = await contract.getNftDetailsByHash(_nftHash);

      // console.log(txRes);

      return txRes;
    }
  };

  const verify = async (_nftHash, _renter) => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      const txRes = await contract.verify(_nftHash, _renter);

      // console.log(txRes);

      return txRes;
    }
  };

  const getOwner = async (_nftHash, _renter) => {
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      const txRes = await contract.getOwner();

      // console.log(txRes);

      return txRes;
    }
  };

  const toggleModal = () => setModal(!modal);

  // Check if it is connected to wallet
  const checkIfWalletIsConnect = async () => {
    // While installing metamask, it has an ethereum object in the window
    // console.log("Connecting wallet avail...");

    if (!window.ethereum) return alert("Please install MetaMask.");

    // Fetch all the eth accounts
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    // console.log("Connecting wallet availddddd...", accounts);
    // Connecting account if exists
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      // console.log("Connected wallet hehehehhehe", accounts);
    } else {
      console.log("No accounts found");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    // console.log("Connecting wallet...");
    checkIfWalletIsConnect();
    if (!window.ethereum) return alert("Please install MetaMask.");

    // Fetch all the eth accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Connecting account if exists
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      // console.log("Connected wallet hehehehhehe", accounts);
    } else {
      console.log("No accounts found");
    }

    // if (!window.ethereum) return alert("Please install MetaMask.");

    // // Fetch all the eth accounts------------------------------------here----------------
    // const accountss = await window.ethereum.request({
    //   method: "eth_accounts",
    // });

    // if (accountss.length) {
    //   console.log("Connected wallet", accountss);
    //   setCurrentAccount(accountss[0]);
    //   return accountss;
    // } else {
    //   console.log("No accounts found");
    // }
    // console.log("Connected wallet", accountss);
  };

  return (
    <DynarentContext.Provider
      value={{
        connectWallet,
        checkIfWalletIsConnect,
        currentAccount,
        toggleModal,
        modal,
        setModal,
        cardId,
        setCardId,
        selectedBtn,
        setSelectedBtn,
        fetchNfts,
        marketplaceNfts,
        myNfts,
        setMyNfts,
        myRentedNfts,
        setApiResult,
        apiResult,
        setImage,
        image,
        getMarketplaceNfts,
        getMyRentedNfts,
        getNftDetailsByHash,
        setNftHash,
        setNftAddress,
        setNftId,
        setNftName,
        setTokenUri,
        setNftPrice,
        setNftDuration,
        setNftChainName,
        setNftAttributes,
        nftAttributes,
        nftHash,
        nftAddress,
        nftId,
        nftName,
        tokenUri,
        nftPrice,
        nftDuration,
        nftChainName,
        setNftDescription,
        nftDescription,
        listToMarketplace,
        rent,
        setRentedNfts,
        rentedNfts,
        returnNft,
      }}
    >
      {children}
    </DynarentContext.Provider>
  );
};

export default DynarentContext;
