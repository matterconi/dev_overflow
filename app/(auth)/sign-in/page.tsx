"use client";

import React from "react";

import AuthForm from "@/components/form/AuthForm";

import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <div>
      <AuthForm
        formType="SIGN_IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmitAction={(data: { email: string; password: string }) =>
          Promise.resolve({
            success: true,
            data,
          })
        }
      />
    </div>
  );
};

export default SignIn;
