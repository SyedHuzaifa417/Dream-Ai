import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SuccessMessageProps = {
  message: string;
};

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <>
      <div className="py-10 px-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Password Changed
        </h1>
        <p className="text-gray-600 mb-3">{message}</p>
        <Image
          src="/svgs/password_success.svg"
          alt="success"
          width={134}
          height={134}
        />
        <Link href="/signin">
          <Button className="w-full mt-6 py-6 bg-purple-920 hover:bg-purple-900">
            Back to Login
          </Button>
        </Link>
      </div>
    </>
  );
}
