import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./modal.module.scss";
import nft1 from "../../assets/as.png";
import DynarentContext from "../../../context/dynarentContext";
import { Revise } from "revise-sdk";
import axios from "axios";
const FormModal = () => {
  const [attributes, setAttributes] = useState([]);
  const [typeofrenting, setTypeofrenting] = useState("stream");
  const [initfee, setInitfee] = useState(0);
  const [noofdays, setNoofdays] = useState(0);
  const [attributeinfocus, setAttributeinfocus] = useState("");
  const [initflow, setInitflow] = useState(0);
  const [typeofinc, setTypeofinc] = useState("1");
  const [attvalue, setAttvalue] = useState(0);
  const [flag, setFlag] = useState(false);
  const {
    toggleModal,
    listToMarketplace,
    cardId,
    nftHash,
    nftAddress,
    nftDescription,
    nftId,
    nftName,
    tokenUri,
    nftPrice,
    nftDuration,
    nftChainName,
    rent,
  } = useContext(DynarentContext);

  useEffect(() => {
    const func = async () => {
      const data = await axios.get(tokenUri);
      setAttributes(data?.data?.attributes);
      // console.log(data?.data?.attributes);
      setAttvalue(data?.data?.attributes[1]?.value);
    };
    func();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.main_content}>
        <div className={styles.main_content_info}>
          <Image
            src={nft1}
            className={styles.main_content_info_image}
            width={160}
            height={160}
            alt="nft"
          />

          <div className={styles.main_content_info_data}>
            <p>Name: {nftName}</p>
            <p className={styles.main_content_info_dataline}>
              Description: {nftDescription}
            </p>
            {attributes?.map((item, idx) => {
              return (
                <p className={styles.main_content_info_dataline} key={idx}>
                  {item.trait_type}: {item.value}
                </p>
              );
            })}

            <p className={styles.main_content_info_dataline}>
              Chain: {nftChainName}
            </p>
          </div>
        </div>

        <div className={styles.main_content_form}>
          <div className={styles.main_content_form_inputwrp}>
            <label
              htmlFor="platform"
              className={styles.main_content_form_label}
            >
              Type of renting
            </label>

            <select
              name=""
              id=""
              className={styles.main_content_form_input}
              onChange={(e) => {
                setTypeofrenting(e.target.value);
              }}
              defaultValue="stream"
            >
              <option value="stream">Stream</option>
              <option value="onetime">One Time</option>
            </select>
          </div>

          <div className={styles.main_content_form_inputwrp}>
            <label
              htmlFor="platform"
              className={styles.main_content_form_label}
            >
              Initial fee (fdaix)
            </label>

            <input
              type="number"
              min={0}
              id="name"
              className={styles.main_content_form_input}
              placeholder="0"
              onChange={(e) => setInitfee(e.target.value)}
            />
          </div>

          <div className={styles.main_content_form_inputwrp}>
            <label
              htmlFor="platform"
              className={styles.main_content_form_label}
            >
              Max no. of days you want to rent (days)
            </label>

            <input
              type="number"
              min={0}
              id="name"
              className={styles.main_content_form_input}
              placeholder="0"
              onChange={(e) => setNoofdays(e.target.value)}
            />
          </div>

          <div className={styles.main_content_form_inputwrp}>
            <label
              htmlFor="platform"
              className={styles.main_content_form_label}
            >
              Attribute in focus
            </label>

            <input
              type="text"
              min={0}
              id="name"
              className={styles.main_content_form_input}
              placeholder=""
              onChange={(e) => setAttributeinfocus(e.target.value)}
            />
          </div>

          <div className={styles.main_content_form_inputwrp}>
            <label
              htmlFor="platform"
              className={styles.main_content_form_label}
            >
              Flowrate after 1st decrease (fdaix/sec)
            </label>

            <input
              type="text"
              min={0}
              id="name"
              className={styles.main_content_form_input}
              placeholder="0"
              onChange={(e) => setInitflow(e.target.value)}
            />
          </div>

          <div className={styles.main_content_form_inputwrp}>
            <label
              htmlFor="platform"
              className={styles.main_content_form_label}
            >
              Increase in flowrate on reduction of attribute
            </label>

            <select
              name=""
              id=""
              className={styles.main_content_form_input}
              onChange={(e) => {
                setTypeofinc(e.target.value);
              }}
              defaultValue="1"
            >
              <option value="0">Constant</option>
              <option value="1">Linear</option>
              <option value="2">Exponential</option>
              <option value="3">Logarithmic</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.main_btns}>
        <button
          className={styles.main_btn_list}
          onClick={async () => {
            // const res2 = await rent(nftHash, currentAccount);
            toggleModal();
            const res = await listToMarketplace(
              nftHash,
              nftAddress,
              nftId,
              nftName,
              tokenUri,
              parseInt(initflow),
              parseInt(typeofinc),
              parseInt(attvalue),
              nftChainName
            );
            console.log(res);
          }}
        >
          List
        </button>
        <button className={styles.main_btn_close} onClick={() => toggleModal()}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FormModal;
