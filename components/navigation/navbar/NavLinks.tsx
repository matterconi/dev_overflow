"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";

import { SheetClose } from "@/components/ui/sheet";
import NAV_LINKS from "@/constants/NavLinks";
import { cn } from "@/lib/utils";

const NavLinks = ({
  isMobileNav = false,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {NAV_LINKS.map((item) => {
        const route =
          item.route === "/profile" && userId ? `/profile/${userId}` : item.route;
        const isActive =
          (pathname.includes(route) && route.length > 1) || pathname === route;

        if (item.route === "/profile") {
          if (!session?.user || !userId) return null;
        }

        return isMobileNav ? (
          <SheetClose asChild key={route}>
            <Link
              href={route}
              key={item.label}
              className={cn(
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900",
                "flex items-center justify-start gap-4 bg-transparent p-4"
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={cn({ "invert-colors": !isActive })}
              />
              <p
                className={cn(
                  isActive ? "base-bold" : "base-medium",
                  !isMobileNav && "max-lg:hidden"
                )}
              >
                {item.label}
              </p>
            </Link>
          </SheetClose>
        ) : (
          <React.Fragment key={route}>
            <Link
              href={route}
              key={item.label}
              className={cn(
                isActive
                  ? "primary-gradient rounded-lg text-light-900 max-lg:w-fit"
                  : "text-dark300_light900",
                "flex items-center justify-start gap-4 bg-transparent p-4"
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
                className={cn({ "invert-colors": !isActive })}
              />
              <p
                className={cn(
                  isActive ? "base-bold" : "base-medium",
                  !isMobileNav && "max-lg:hidden"
                )}
              >
                {item.label}
              </p>
            </Link>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
