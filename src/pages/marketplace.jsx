import React, { useContext, useEffect } from "react";
import Card from "./components/card";
import styles from "./marketplace.module.scss";
import { DynarentContext } from "../../context/dynarentContext";

const Marketplace = () => {
  const {
    modal,
    cardId,
    setCardId,
    currentAccount,
    myNfts,
    marketplaceNfts,
    connectWallet,
    getMarketplaceNfts,
  } = useContext(DynarentContext);

  useEffect(() => {
    console.log("helloooooooo", currentAccount);
    if (currentAccount === "") {
      connectWallet();
    } else {
      getMarketplaceNfts();
    }
  }, [currentAccount]);

  return (
    <div className={styles.marketplace}>
      {console.log("marketplaceNfts", marketplaceNfts)}
      {marketplaceNfts.map((nft, index) => (
        <Card
          handleSetState={() => {
            setCardId(index);
          }}
          nftData={nft}
          key={index}
        />
      ))}
    </div>
  );
};

export default Marketplace;
