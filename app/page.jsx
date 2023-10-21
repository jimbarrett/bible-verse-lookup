import Lookup from "@components/Lookup";
import { LookupProvider } from "./context/LookupContext";
import VersionSelector from "@components/VersionSelector";

const Home = async () => {
  return (
    <LookupProvider>
      <div>
        <VersionSelector />
        <Lookup />
      </div>
    </LookupProvider>
  );
};

export default Home;
