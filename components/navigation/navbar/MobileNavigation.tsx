"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import NavLinks from "@/components/navigation/navbar/NavLinks";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";
import { SignOutUser } from "@/lib/actions/auth.action";

const MobileNavigation = ({ userId }: { userId?: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="sm:hidden" type="button" aria-label="Open menu">
          <Image src="/icons/hamburger.svg" width={36} height={36} alt="Menu" className="invert-colors" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="background-light900_dark200 border-none">
        <SheetHeader>
          <SheetTitle className="hidden">Open Me!</SheetTitle>
          <Link href="/" className="flex items-center gap-1">
            <Image src="/images/site-logo.svg" width={23} height={23} alt="logo" />
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Dev<span className="text-primary-500">Flow</span>
            </p>
          </Link>

          <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav userId={userId} />
            </section>

            <div className="flex flex-col gap-3">
              {userId ? (
                <form action={SignOutUser}>
                  <SheetClose asChild>
                    <Button
                      type="submit"
                      className="sm:medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                    >
                      <span className="primary-text-gradient">Logout</span>
                    </Button>
                  </SheetClose>
                </form>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="sm:medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                    >
                      <Link href={ROUTES.SIGN_IN}>
                        <span className="primary-text-gradient">Sign In</span>
                      </Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="sm:medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
                    >
                      <Link href={ROUTES.SIGN_UP}>Sign Up</Link>
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
