"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
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
import { useUserProfile, useUploadProfilePicture, useRemoveProfilePicture } from "@/app/services/user/userHooks";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/app/services/auth/authContext";

type ProfileChangeAction = 'NONE' | 'UPLOAD' | 'REMOVE';

const accountFormSchema = z.object({
  signInMethod: z.string(),
  profile_picture: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
});

export type AccountFormData = z.infer<typeof accountFormSchema> & {
  profile_picture_file?: File;
};

interface AccountFormProps {
  onSaveChanges: (data: AccountFormData) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({
  onSaveChanges,
}) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth(); 

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileChangeAction, setProfileChangeAction] = useState<ProfileChangeAction>('NONE');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalProfilePicRef = useRef<string | null>(null);

  const shouldFetchProfile = Boolean(isAuthenticated);
  
  const { data: userData, isLoading } = useUserProfile(shouldFetchProfile);
  const { mutate: uploadProfilePicture, isPending: isUploading } = useUploadProfilePicture();
  const { mutate: removeProfilePicture, isPending: isRemoving } = useRemoveProfilePicture();

  
  
  const accountForm = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      signInMethod: "Google Email",
      profile_picture: "",
      email: "",
      username: "",
    },
  });
  
  useEffect(() => {
    if (userData) {
      if (userData.profile_picture && originalProfilePicRef.current === null) {
        originalProfilePicRef.current = userData.profile_picture;
      }
      
      accountForm.reset({
        signInMethod: "Google Email",
        profile_picture: userData.profile_picture || "",
        email: userData.email,
        username: userData.name,
      });
      
      if (userData.profile_picture && profileChangeAction === 'NONE') {
        setPreviewImage(userData.profile_picture);
      }
    }
  }, [userData, profileChangeAction, accountForm]);
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      accountForm.setValue("profile_picture_file", file);
      setProfileChangeAction('UPLOAD');
      
      toast({
        title: "Image selected",
        description: "Your profile picture will be updated when you save changes",
      });
    }
  };

  const handleImageAreaClick = () => {
    if (!isUploading && !isRemoving) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setProfileChangeAction('REMOVE');
    setPreviewImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Image removed",
      description: "Your profile picture will be removed when you save changes",
    });
  };

  const hasProfilePictureChanges = (): boolean => {
    switch (profileChangeAction) {
      case 'UPLOAD':
      case 'REMOVE':
        return true;
      default:
        return false;
    }
  };

  const handleFormSubmit = (data: AccountFormData) => {
    if (!hasProfilePictureChanges()) {
      toast({
        title: "No changes",
        description: "No profile picture changes to save",
        variant: "default",
      });
      return;
    }
    
    setIsSaving(true);
    
    const handleSuccess = () => {
      setIsSaving(false);
      setProfileChangeAction('NONE'); 
      
      if (profileChangeAction === 'UPLOAD') {
        toast({
          title: "Success",
          description: "Profile picture uploaded successfully",
          variant: "default",
        });
      } else if (profileChangeAction === 'REMOVE') {
        toast({
          title: "Success",
          description: "Profile picture removed successfully",
          variant: "default",
        });
      }
      
      onSaveChanges(data);
    };
    
    const handleError = (error: any) => {
      setIsSaving(false);
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile",
        variant: "destructive",
      });
    };
    
    try {
      if (profileChangeAction === 'UPLOAD' && data.profile_picture_file) {
        console.log('Uploading file:', data.profile_picture_file);
        
        uploadProfilePicture(data.profile_picture_file, {
          onSuccess: (data) => {
            console.log('Upload success:', data);
            handleSuccess();
          },
          onError: (error) => {
            console.error('Upload error:', error);
            handleError(error);
          }
        });
      } else if (profileChangeAction === 'REMOVE') {
        console.log('Removing profile picture');
        
        removeProfilePicture(undefined, {
          onSuccess: (data) => {
            console.log('Remove success:', data);
            handleSuccess();
          },
          onError: (error) => {
            console.error('Remove error:', error);
            handleError(error);
          }
        });
      } else {
        console.log('No action taken');
        setIsSaving(false);
      }
    } catch (error) {   
      console.error('Caught error:', error);
      handleError(error);
    }
  };

  return (
    <Form {...accountForm}>
      <form
        onSubmit={accountForm.handleSubmit(handleFormSubmit)}
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
                  disabled
                  className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 w-max max-lg:w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={accountForm.control}
          name="profile_picture"
          render={({ field }) => (
            <FormItem>
              <h2 className="text-xl font-semibold text-white ">
                Profile Picture
              </h2>
              <div className="mt-2">
                <div 
                  className="w-40 h-40 rounded-lg overflow-hidden bg-gray-800 flex justify-center items-center relative cursor-pointer"
                  onClick={handleImageAreaClick}
                >
                  {previewImage ? (
                    <>
                      <Image 
                        src={previewImage} 
                        alt="Profile picture" 
                        width={160} 
                        height={160} 
                        className="object-cover w-full h-full"
                      />
                      <button 
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition-all"
                        disabled={isRemoving}
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-white/50 text-center p-4">
                      Click here to upload new photo
                    </div>
                  )}
                  {(isUploading || isRemoving) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-white text-sm">
                        {isUploading ? 'Uploading...' : 'Removing...'}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <FormControl>
                <Input 
                  {...field} 
                  type="hidden" 
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
                (Your account email address)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={true}
                  readOnly={true}
                  className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 w-max max-lg:w-full cursor-not-allowed opacity-70"
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
                  disabled={true}
                  readOnly={true}
                  className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5 w-max max-lg:w-full cursor-not-allowed opacity-70"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="px-14 bg-indigo-650 text-white py-5 rounded-lg hover:bg-indigo-700 transition-all w-max max-lg:w-full"
          disabled={!hasProfilePictureChanges() || isUploading || isRemoving || isSaving || isLoading}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
