import Image from "next/image";
import Link from "next/link";
import React from "react";

import { ModeToggle } from "./Theme";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          className=""
          src="/images/site-logo.svg"
          alt="logo"
          width="23"
          height="23"
        />

        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <p>Global Search</p>

      <ModeToggle />
    </nav>
  );
};

export default Navbar;
