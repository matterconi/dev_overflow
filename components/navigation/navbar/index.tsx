import Image from "next/image";
import Link from "next/link";
import React from "react";

import UserAvatar from "@/components/UserAvatar";
import MobileNavigation from "@/components/navigation/navbar/MobileNavigation";
import GlobalSearch from "@/components/search/GlobalSearch";
import { auth } from "@/auth";

import { ModeToggle } from "./Theme";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/images/site-logo.svg" alt="logo" width={23} height={23} />

        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <GlobalSearch />

      <div className="flex-between gap-5">
        <ModeToggle />

        {user?.id && <UserAvatar id={user.id} name={user.name ?? "User"} imageUrl={user.image} />}

        <MobileNavigation userId={user?.id} />
      </div>
    </nav>
  );
};

export default Navbar;
