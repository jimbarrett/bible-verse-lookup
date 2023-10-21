import Lookup from "@components/Lookup";
import { LookupProvider } from "./context/LookupContext";

const Home = async () => {
  return (
    <LookupProvider>
      <div>
        <Lookup />
      </div>
    </LookupProvider>
  );
};

export default Home;
