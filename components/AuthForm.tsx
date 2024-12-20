"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import SignIn from "@/app/(auth)/sign-in/page";
import { useRouter } from "next/dist/client/components/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Sign up with Appwrite create plaid token
      if (type === "Sign-Up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };

        const newUser = await signUp(userData);
        setUser(newUser);
      }
      if (type === "Sign-In") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Cyber logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            {" "}
            CyberDollar{" "}
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "Sign-In" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user ? "Link your account" : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/*PlaidLink*/}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "Sign-Up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name "
                      placeholder="First Name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name "
                      placeholder="Last Name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Address"
                  />
                  <div className="flex gap-6">
                    <CustomInput
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="City"
                    />
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="State"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="PostalCode"
                      placeholder="Postal Code"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="DateOfBirth"
                      placeholder="YYYY-MM-DD "
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="Example: 1234"
                    />
                  </div>
                </>
              )}

              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />

              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Loading...
                    </>
                  ) : type === "Sign-In" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "Sign-In"
                ? "Dont have an account ? "
                : "Already have an account ? "}
            </p>
            <Link
              href={type === "Sign-In" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "Sign-In" ? "Sign-Up" : "Sign-In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
