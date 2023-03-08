import { DynarentProvider } from "../../context/dynarentContext";
import Navbar from "./common_components/Navbar/Navbar";
import "../styles/globals.css";
import { SuperfluidProvider } from "../../context/superfluidContext";

export default function App({ Component, pageProps }) {
  return (
    <DynarentProvider>
      <SuperfluidProvider>
        <div className="App">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </SuperfluidProvider>
    </DynarentProvider>
  );
}
