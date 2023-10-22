import Lookup from "@components/Lookup";
import { LookupProvider } from "./context/LookupContext";

const Home = async () => {
  return (
    <LookupProvider>
      <Lookup />
    </LookupProvider>
  );
};

export default Home;
