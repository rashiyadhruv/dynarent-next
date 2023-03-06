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
    RentedNfts,
  } = useContext(DynarentContext);

  useEffect(() => {
    console.log("helloooooooo", currentAccount);
    if (currentAccount === "") {
      connectWallet();
    } else {
      getMyRentedNfts(currentAccount);
    }
  }, [currentAccount]);

  return (
    <div className={styles.marketplace}>
      {console.log("marketplaceNfts", RentedNfts)}
      {/* {RentedNfts.map((nft, index) => (
        <Card
          handleSetState={() => {
            setCardId(index);
          }}
          nftData={nft}
          key={index}
        />
      ))} */}{" "}
      heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    </div>
  );
};

export default Rentedassets;
