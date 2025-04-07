"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const accountFormSchema = z.object({
  signInMethod: z.string(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
});

const deleteFormSchema = z.object({
  deleteEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
});

export type AccountFormData = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  onSaveChanges: (data: AccountFormData) => void;
  onDeleteAccount: (email: string) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({
  onSaveChanges,
  onDeleteAccount,
}) => {
  const accountForm = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      signInMethod: "Google Email",
      email: "yourname@email.com",
      username: "YourName22",
    },
  });

  const deleteForm = useForm({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      deleteEmail: "",
    },
  });

  const handleDeleteAccount = (values: { deleteEmail: string }) => {
    if (values.deleteEmail) {
      onDeleteAccount(values.deleteEmail);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 relative pb-8 pt-5">
      <div className="mx-8 max-sm:ml-4">
        <Form {...accountForm}>
          <form
            onSubmit={accountForm.handleSubmit(onSaveChanges)}
            className="space-y-6"
          >
            <FormField
              control={accountForm.control}
              name="signInMethod"
              render={({ field }) => (
                <FormItem>
                  <h2 className="text-xl font-semibold text-white ">
                    Sign in Method
                  </h2>
                  <FormLabel className="text-sm text-gray-600">
                    (this field is selected automatically based on which method
                    you use to sign in)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 w-max max-lg:w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={accountForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <h2 className="text-xl font-semibold text-white ">Email</h2>
                  <FormLabel className="text-sm text-gray-600">
                    (Changing your email will also change the Google account
                    associated with it.)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 w-max max-lg:w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={accountForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Username
                  </h2>

                  <FormControl>
                    <Input
                      {...field}
                      className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 w-max max-lg:w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="px-14 bg-indigo-650 text-white py-5 rounded-lg hover:bg-indigo-700 transition-all w-max max-lg:w-full"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </div>

      <div className="absolute left-1/2 top-0 bottom-0 hidden lg:block border-l border-white h-full" />
      <div className="mt-8 block lg:hidden border-b border-white w-full" />

      <div className="mx-8 max-sm:ml-4 mt-8 lg:mt-0">
        <Form {...deleteForm}>
          <form
            onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}
            className="space-y-6"
          >
            <FormField
              control={deleteForm.control}
              name="deleteEmail"
              render={({ field }) => (
                <FormItem>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Delete Your Account
                  </h2>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="enter your email address"
                      className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 w-max max-lg:w-full mb-4"
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-gray-600">
                    Once you delete your account you will lose all data on this
                    app.
                  </FormLabel>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="px-10 bg-indigo-650 text-white py-5 rounded-lg hover:bg-indigo-700 transition-all w-max max-lg:w-full"
            >
              Delete my account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountForm;
