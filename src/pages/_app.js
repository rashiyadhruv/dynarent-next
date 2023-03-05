import { DynarentProvider } from "../../context/dynarentContext";
import Navbar from "./common_components/Navbar/Navbar";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <DynarentProvider>
      <div className="App">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </DynarentProvider>
  );
}
