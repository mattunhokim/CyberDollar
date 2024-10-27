import AuthForm from "@/components/AuthForm";
import React from "react";

const SignIn = (p0: { email: string; password: string }) => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="Sign-In" />
    </section>
  );
};

export default SignIn;
