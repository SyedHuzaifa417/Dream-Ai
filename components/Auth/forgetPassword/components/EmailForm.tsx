import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailFormProps = {
  onSubmit: (email: string) => void;
  isSubmitting: boolean;
};

export type EmailFormData = z.infer<typeof emailSchema>;

export function EmailForm({ onSubmit, isSubmitting }: EmailFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const handleFormSubmit = (data: EmailFormData) => {
    onSubmit(data.email);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 text-center pt-7">
        Forgot Password
      </h1>
      <p className="text-center text-sm text-gray-900 py-2 px-2">
        Don&apos;t worry! It occurs. Please enter the email address linked with
        your account
      </p>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-2 px-10 max-lg:px-6"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full py-6"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex justify-center pt-5">
          <Button
            type="submit"
            className="w-full bg-purple-920 hover:bg-purple-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Send Link"}
          </Button>
        </div>
      </form>
    </>
  );
}
