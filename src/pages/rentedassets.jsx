import React, { useContext, useEffect } from "react";
import Card from "./components/card";
import styles from "./marketplace.module.scss";
import { DynarentContext } from "../../context/dynarentContext";

const Rentedassets = () => {
  const {
    modal,
    cardId,
    setCardId,
    currentAccount,
    myNfts,
    marketplaceNfts,
    connectWallet,
    getMarketplaceNfts,
    getMyRentedNfts,
    rentedNfts,
    
  } = useContext(DynarentContext);

  useEffect(() => {
    const fet = async () => {
      console.log("helloooooooo", currentAccount);
      if (currentAccount === "") {
        connectWallet();
      } else {
        let ans = await getMyRentedNfts(currentAccount);
        console.log("ans", ans);
      }
    };
    fet();
    console.log("qwwwwwewewewe", rentedNfts);
  }, [currentAccount]);

  return (
    <div className={styles.marketplace}>
      {console.log("marketplaceNfts", rentedNfts)}
      {rentedNfts.map((nft, index) => (
        <Card
          handleSetState={() => {
            setCardId(index);
          }}
          nftData={nft}
          key={index}
          type="2"
        />
      ))}{" "}
    </div>
  );
};

export default Rentedassets;
