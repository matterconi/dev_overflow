"use client";

import React from "react";

import AuthForm from "@/components/form/AuthForm";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: "", password: "", name: "", username: "" }}
      onSubmitAction={(data) =>
        Promise.resolve({
          success: true,
          data,
        })
      }
    />
  );
};

export default SignUp;
