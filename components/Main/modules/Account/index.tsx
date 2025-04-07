"use client";

import React from "react";
import AccountForm, { AccountFormData } from "./components/AccountForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AccountPage = () => {
  const onSaveChanges = (values: AccountFormData) => {
    console.log(values);
  };

  const onDeleteAccount = (email: string) => {
    if (email) {
      console.log("Delete account for:", email);
    }
  };

  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none py-4 overflow-y-auto overflowY">
        <h1 className="text-2xl max-sm:text-xl font-semibold text-white text-start capitalize my-5  max-sm:my-3 ml-8 max-sm:ml-4">
          Account Settings
        </h1>
        <div className="border-b w-full " />

        <AccountForm
          onSaveChanges={onSaveChanges}
          onDeleteAccount={onDeleteAccount}
        />
        <div className="border-b w-full" />

        <div>
          <h1 className="text-2xl max-sm:text-xl font-semibold text-white text-start capitalize my-5 max-sm:my-3 ml-8 max-sm:ml-4">
            Your Subscription Package
          </h1>
          <div className="border-b w-full mb-5" />
          <div className="mx-8 max-sm:ml-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
              <div>
                <div className="w-max max-lg:w-full">
                  <h3 className="text-xl font-medium text-white mb-4">
                    Package
                  </h3>
                  <div className="flex items-center justify-between">
                    <Input
                      value="Professional Package"
                      className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 "
                    />
                    <Button className="ml-2 bg-indigo-650 text-white py-5 px-8 rounded-lg hover:bg-indigo-700 transition-all">
                      Update
                    </Button>
                  </div>
                </div>

                <div className="w-max max-lg:w-full">
                  <h3 className="text-xl font-medium text-white my-4">Price</h3>
                  <Input
                    value="$9.99 / week"
                    className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5"
                  />
                </div>
              </div>

              <div>
                <div className="w-max max-lg:w-full">
                  <h3 className="text-xl font-medium text-white mb-4 max-lg:mt-4">
                    Next Billing Date
                  </h3>
                  <Input
                    value="15/02/25"
                    className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5"
                  />
                </div>
                <div className="w-max max-lg:w-full">
                  <h3 className="text-xl font-medium text-white my-4">
                    Payment Method
                  </h3>
                  <div className="flex items-center justify-between">
                    <Input
                      value="Credit Card"
                      className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5"
                    />
                    <Button className="ml-2 bg-indigo-650 text-white py-5 px-8 rounded-lg hover:bg-indigo-700 transition-all">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
