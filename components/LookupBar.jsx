"use client";

import { LookupContext } from "@app/context/LookupContext";
import VersionSelector from "./VersionSelector";
import { useContext } from "react";
import PerPageSelector from "./PerPageSelector";

const LookupBar = () => {
  const { perPage, setPerPage } = useContext(LookupContext);
  return (
    <div className="w-full flex justify-between pb-4 items-end ">
      <div className="w-1/5">
        <VersionSelector />
      </div>
      <div className="w-1/5">
        <PerPageSelector />
      </div>
    </div>
  );
};

export default LookupBar;
