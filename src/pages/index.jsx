import React from "react";
import styles from "./home.module.scss";
// import { ReactComponent as Homee } from "../../assets/Frame 6.svg";
import Image from "next/image";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* <Homee /> */}
      <Image
        className={styles.imagee}
        priority
        src="./home.svg"
        alt="next"
        width={1000}
        height={2000}
      />
    </div>
  );
};

export default Home;
