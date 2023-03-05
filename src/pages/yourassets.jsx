import React, { useContext, useEffect } from "react";
import styles from "./yourassets.module.scss";
import { DynarentContext } from "../../context/dynarentContext";
import Card from "./components/card";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import FormModal from "./components/modal";

const MORALIS_API_KEY =
  "87yk4fb4AAHHi3AFBTFNT2Ex7X735AGZ837cC2wYwkPu9nZa1xN9cDzwLkPvwRAW";

const YourAssets = () => {
  const {
    modal,
    cardId,
    setCardId,
    connectWallet,
    myNfts,
    fetchNfts,
    setMyNfts,
    currentAccount,
  } = useContext(DynarentContext);

  useEffect(() => {
    console.log("helloooooooo", currentAccount);
    if (currentAccount === "") {
      connectWallet();
    } else {
      fetchNfts(currentAccount);
    }
  }, [currentAccount]);

  return (
    <>
      {modal && (
        <>
        <div className={styles.blur}>
        </div>
        <div className={styles.wrapper}>
          <FormModal />
        </div>
        </>
      )}
      <div className={styles.yourassets}>
        {myNfts?.map((nft, index) =>
          index === 0 ? null : (
            <Card
              handleSetState={() => {
                setCardId(index);
              }}
              nftData={nft}
              key={index}
            />
          )
        )}
      </div>
    </>
  );
};

export default YourAssets;
