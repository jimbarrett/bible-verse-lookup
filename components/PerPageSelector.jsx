"use client";
import { useContext, useState } from "react";
import { LookupContext } from "@app/context/LookupContext";
import PlainSelector from "./PlainSelector";

const PerPageSelector = () => {
  const { perPage, setPerPage } = useContext(LookupContext);

  const updatePerPage = (item) => {
    setPerPage(item.k);
  };

  const items = [{ k: 1 }, { k: 2 }, { k: 3 }, { k: 4 }, { k: 5 }];

  return (
    <>
      <label className="pr-2 text-sm">Results per page</label>
      <PlainSelector
        value={perPage}
        items={items}
        value_field="k"
        label_field="k"
        select={updatePerPage}
      />
    </>
  );
};

export default PerPageSelector;
