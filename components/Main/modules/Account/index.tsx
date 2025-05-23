"use client";

import React from "react";
import AccountForm, { AccountFormData } from "./components/AccountForm";
import DeleteForm from "./components/DeleteForm";
import SubscriptionForm from "./components/SubscriptionForm";
import { useAuth } from "@/app/services/auth/authContext";

const AccountPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  

  const onSaveChanges = (values: AccountFormData) => {
    console.log("Saving changes:", values);
  };

  const onDeleteAccount = (email: string) => {
    if (email) {
      console.log("Account deleted for:", email);
      logout();
      
    }
  };

  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0 relative">
        {/* {!isAuthenticated && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg text-white text-center">
            <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
            <p>Please log in to view and edit your profile</p>
          </div>
        </div>
      )} */}
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none py-4 overflow-y-auto overflowY">
        {/* Account Settings Header */}
        <h1 className="text-2xl max-sm:text-xl font-semibold text-white text-start capitalize my-5 max-sm:my-3 ml-8 max-sm:ml-4">
          Account Settings
        </h1>
        <div className="border-b w-full" />

       <div className="flex items-start gap-8 max-lg:flex-col max-lg:gap-2">
        <div className="p-8">
          <AccountForm onSaveChanges={onSaveChanges} />
        </div>
        
        <div className="w-[1px] bg-white self-stretch max-lg:hidden"/>
        <div className="border-b w-full hidden max-lg:block"/>
        <div className="p-8 w-1/2 max-lg:w-full">
          <DeleteForm 
            userEmail={user?.email} 
            onDeleteAccount={onDeleteAccount} 
          />
        </div>
       </div>
        
        <div className="border-b w-full" />
        {/* Subscription Section */}
        <SubscriptionForm />
      </div>
    </div>
  );
};

export default AccountPage;
