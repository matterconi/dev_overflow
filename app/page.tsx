import React from "react";
import { auth } from "@/auth";

const Page = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <h1 className="flex gap-4 text-3xl font-black text-black  ">
        Hello, and welcome
      </h1>
      <p className="h1-bold font-space-grotesk">
        To the incredible world of NextJS!
      </p>
    </div>
  );
};

export default Page;
