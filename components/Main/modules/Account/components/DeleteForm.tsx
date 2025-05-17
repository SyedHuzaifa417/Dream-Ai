"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { useDeleteUser } from "@/app/services/user/userHooks";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const deleteFormSchema = z.object({
  deleteEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
});

interface DeleteFormProps {
  userEmail: string | undefined;
  onDeleteAccount: (email: string) => void;
}

const DeleteForm: React.FC<DeleteFormProps> = ({
  userEmail,
  onDeleteAccount,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: deleteUser, isPending: isUserDeleting } = useDeleteUser();

  const deleteForm = useForm({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      deleteEmail: userEmail || "",
    },
  });

  React.useEffect(() => {
    if (userEmail) {
      deleteForm.setValue('deleteEmail', userEmail);
    }
  }, [userEmail, deleteForm]);


  const handleDeleteAccount = (values: { deleteEmail: string }) => {
    if (values.deleteEmail) {
      setIsDeleting(true);
      
      toast({
        title: "Processing",
        description: "Deleting your account...",
        variant: "default",
      });
      
      deleteUser(undefined, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Your account has been deleted successfully",
            variant: "default",
          });
          
          if (onDeleteAccount) {
            onDeleteAccount(values.deleteEmail);
          }
          
          setTimeout(() => {
            router.push('/');
          }, 1500);
        },
        onError: (error) => {
          setIsDeleting(false);
          console.error('Error deleting account:', error);
          toast({
            title: "Error",
            description: error?.message || "Failed to delete account",
            variant: "destructive",
          });
        },
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter your email address to confirm deletion",
        variant: "destructive",
      });
    }
  };

  return (
      <Form {...deleteForm}>
        <form
          onSubmit={deleteForm.handleSubmit(handleDeleteAccount)}
          className="space-y-6 "
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
            disabled={isDeleting || isUserDeleting}
          >
            {isDeleting || isUserDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting account...
              </>
            ) : (
              "Delete my account"
            )}
          </Button>
        </form>
      </Form>
  );
};

export default DeleteForm;
