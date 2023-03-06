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
    console.log("hellll", currentAccount);
    if (currentAccount === "") {
      connectWallet();
    } else {
      console.log("getting marketplace nfts");
      getMarketplaceNfts();
    }
  }, [currentAccount]);

  return (
    <div className={styles.marketplace}>
      {console.log("marketplaceNfts", marketplaceNfts)}
      {marketplaceNfts.map((nft, index) =>
        nft.isRented === false ? (
          <Card
            handleSetState={() => {
              setCardId(index);
            }}
            nftData={nft}
            key={index}
            type="1"
          />
        ) : null
      )}
    </div>
  );
};

export default Marketplace;
