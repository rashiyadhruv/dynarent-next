import styles from "./Navbar.module.scss";
import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as Revise } from "../../../../assets/revise.svg";
import { DynarentContext } from "../../../../context/dynarentContext";
import Link from "next/link";
import { SuperfluidContext } from "../../../../context/superfluidContext";

const Navbar = () => {
  const [address, setAddress] = useState("0");
  const { connectWallet, currentAccount } = useContext(DynarentContext);
  const { streamstart, streamdelete } = useContext(SuperfluidContext);

  useEffect(() => {
    console.log("hello0", currentAccount);
  }, [currentAccount]);

  return (
    <div className={styles.navbar}>
      <Link className={styles.navbar__logo} href="/">
        DYNARENT
      </Link>
      <div className={styles.navbar__links}>
        <Link className={styles.btn} href="/marketplace">
          Marketplace
        </Link>
        <Link className={styles.btn} href="/yourassets">
          Your owned Assets
        </Link>
        <Link className={styles.btn} href="/rentedassets">
          Your rented assets
        </Link>
        {/* <div
          className={styles.btn}
          onClick={async () => {
            await streamdelete(currentAccount);
          }}
        >
          exp
        </div> */}
        <div
          className={`${styles.btn} ${styles.connect}`}
          onClick={async () => {
            await connectWallet();
          }}
        >
          {currentAccount === ""
            ? "Connect Wallet"
            : `${currentAccount.toString().slice(0, 6)}...${currentAccount
                .toString()
                .slice(-4)}`}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
