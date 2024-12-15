import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, useForm } from "react-hook-form";
import { ZodObject } from "zod";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodObject<any>; // Fix the schema type
  defaultValues: DefaultValues<T>;
  onSubmitAction: (data: T) => Promise<{ success: boolean; data: T } | null>;
  formType: "SIGN_IN" | "SIGN_UP";
}

export default function AuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmitAction,
}: AuthFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-6 mt-10"
      >
        {(Object.keys(defaultValues) as Path<T>[]).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    placeholder={`Enter ${String(fieldName)}`}
                    {...field}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 roundend-1.5 border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signing In..."
              : "Signing Up..."
            : buttonText}
        </Button>
        {formType === "SIGN_IN" ? (
          <p>
            You don't have an account?{" "}
            <Link href={ROUTES.SIGN_UP}>
              <span className="paragraph-semibold text-primary-500 cursor-pointer">
                Sign Up
              </span>
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href={ROUTES.SIGN_IN}>
              <span className="paragraph-semibold text-primary-500 cursor-pointer">
                Sign In
              </span>
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
}
