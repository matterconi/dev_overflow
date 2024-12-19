import React from "react";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Button } from "@/components/ui/button";
import NavLinks from "@/components/navigation/navbar/NavLinks";

const LeftSidebar = () => {
  return (
    <section
      className="custom-scrollbar bg-light900_dark200 light-border left-0 top-0 h-screen flex flex-col justify-between overflow-h-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]"
    >
      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-6">
        <NavLinks />
      </nav>

      {/* Footer Section */}
      <div className="flex flex-col gap-3 p-4">
        <Button className="sm:medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none" asChild>
          <Link href={ROUTES.SIGN_IN}>
              <Image src="/icons/account.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden"/>
              <span className="primary-text-gradient max-lg:hidden">Sign In</span>
          </Link>
        </Button>
        <Button className="sm:medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
          <Link href={ROUTES.SIGN_UP}>
            <Image src="/icons/sign-up.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden"/>
            <span className="max-lg:hidden">Sign Up</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LeftSidebar;
