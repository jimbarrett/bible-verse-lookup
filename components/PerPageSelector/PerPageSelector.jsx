"use client";
import { useContext, useState } from "react";
import { LookupContext } from "@app/context/LookupContext";
import PlainSelector from "@components/PlainSelector";

const PerPageSelector = () => {
  const { perPage, setPerPage } = useContext(LookupContext);

  const updatePerPage = (item) => {
    setPerPage(item.k);
  };

  const items = [];
  for (let i = 1; i <= 10; i++) {
    items.push({ k: i });
  }

  return (
    <>
      <label className="pr-2 text-xs italic">Results per page</label>
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
