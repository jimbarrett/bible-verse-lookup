import Lookup from "@components/Lookup";
import { BibleProvider } from "@app/context/BibleContext";

const Home = async () => {
  return (
    <BibleProvider>
      <div>
        <Lookup />
      </div>
    </BibleProvider>
  );
};

export default Home;
