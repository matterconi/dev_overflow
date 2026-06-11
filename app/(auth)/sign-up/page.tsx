"use client";

import React from "react";

// NOTE: Registrazione tramite email/password disabilitata. Si accede solo tramite provider (vedi SocialAuthForm nel layout).
// La logica resta intatta ma non è accessibile: per riattivarla scommentare il blocco sottostante e gli import.
// import AuthForm from "@/components/form/AuthForm";
// import { SignUpSchema } from "@/lib/validations";
// import { SignUpWithCredentials } from "@/lib/actions/auth.action";

const SignUp = () => {
  return null;
  // return (
  //   <AuthForm
  //     formType="SIGN_UP"
  //     schema={SignUpSchema}
  //     defaultValues={{ email: "", password: "", name: "", username: "" }}
  //     onSubmit={SignUpWithCredentials}
  //   />
  // );
};

export default SignUp;
