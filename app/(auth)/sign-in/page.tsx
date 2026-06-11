"use client";

import React from "react";

// NOTE: Login tramite email/password disabilitato. Si accede solo tramite provider (vedi SocialAuthForm nel layout).
// La logica resta intatta ma non è accessibile: per riattivarla scommentare il blocco sottostante e gli import.
// import AuthForm from "@/components/form/AuthForm";
// import { SignInSchema } from "@/lib/validations";
// import { SignInWithCredentials } from "@/lib/actions/auth.action";

const SignIn = () => {
  return null;
  // return (
  //   <div>
  //     <AuthForm
  //       formType="SIGN_IN"
  //       schema={SignInSchema}
  //       defaultValues={{ email: "", password: "" }}
  //       onSubmit={SignInWithCredentials}
  //     />
  //   </div>
  // );
};

export default SignIn;
