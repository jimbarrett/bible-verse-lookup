import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <nav className="mainNav">
      <Link href="/" className="flex gap-2 flex-center text-xl font-bold">
        <h1>Bible Verse Lookup</h1>
      </Link>
    </nav>
  );
};

export default Nav;
