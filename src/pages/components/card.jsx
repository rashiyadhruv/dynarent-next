import React, { useContext, useEffect } from "react";
import styles from "./card.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import DynarentContext from "../../../context/dynarentContext";

const Card = ({ handleSetState, nftData }) => {
  const {
    toggleModal,
    setNftDescription,
    setNftAttributes,
    image,
    setImage,
    apiResult,
    setApiResult,
    setNftHash,
    setNftAddress,
    setNftId,
    setNftName,
    setTokenUri,
    setNftPrice,
    setNftDuration,
    setNftChainName,
    currentAccount,
    rent,
  } = useContext(DynarentContext);

  const router = useRouter();
  const path = router.pathname;

  const handleModal = () => {
    handleSetState();
    toggleModal();
  };

  useEffect(() => {
    const func = async () => {
      console.log(nftData?.tokenUri);
      let urll = "";
      urll = nftData?.tokenUri;
      if (urll !== "" && urll !== null) {
        if (urll?.toString().split(0, 4) === "https") {
          const result = await axios(`${nftData?.tokenUri}`);
          setApiResult(result);

          setImage(result.data.image);
        } else {
          const result = await axios(`https://rentalassets.revise.link/1`);
          setApiResult(result);

          setImage(result.data.image);
        }
      } else {
        const result = await axios(`https://rentalassets.revise.link/1`);
        setApiResult(result);

        setImage(result.data.image);
      }
    };

    func();
  }, []);

  return (
    <>
      {path === "/yourassets" ? (
        <div className={styles.main}>
          <Image
            src={image}
            alt="Shoes"
            className={styles.main_image}
            width={100}
            height={100}
          />

          <div className={styles.main_info}>
            <p>
              Name: {nftData.tokenName ? nftData.tokenName : nftData.nftName}
            </p>
            <p>Description: {apiResult.data?.description}</p>
            <p>TokenId: {nftData.tokenId}</p>
            <p>Chain: {nftData.chainName}</p>
            <div className={styles.main_btnwrp}>
              <button
                className={styles.main_btn}
                onClick={() => {
                  handleModal();
                  setNftHash(nftData.tokenHash);
                  setNftAddress(nftData.tokenAddress);
                  setNftId(nftData.tokenId);
                  setNftName(nftData.tokenName);
                  setTokenUri(nftData.tokenUri);
                  setNftChainName(nftData.chainName);
                  setNftDescription(apiResult.data?.description);
                  setNftAttributes(apiResult.data?.attributes);
                }}
              >
                LIST
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.main2}>
          <Image
            src={image}
            alt="Shoes"
            className={styles.main_image}
            width={100}
            height={100}
          />
          <div className={styles.main_info}>
            <p>
              Name: {nftData.tokenName ? nftData.tokenName : nftData.nftName}
            </p>
            <p>Description: {apiResult.data?.description}</p>
            <p>TokenId: {nftData?.nftId}</p>
            <p>Chain: {nftData?.chainName}</p>
            <p>Init Price: {nftData?.price.toString()}</p>
            <p>
              Init Flow:{" "}
              {(parseInt(nftData?.duration.toString()) / 1000000000)
                .toFixed(9)
                .toString()}
            </p>
            <p>
              Owner: {nftData?.owner.toString().slice(0, 6)}...
              {nftData?.owner.toString().slice(-5)}
            </p>
            <div className={styles.main_btnwrp}>
              <button
                className={styles.main_btn}
                onClick={async () => {
                  console.log(nftData?.nftHash);
                  rent(nftData?.nftHash, currentAccount);
                }}
              >
                RENT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
