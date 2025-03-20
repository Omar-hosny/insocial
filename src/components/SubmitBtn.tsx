"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

const SubmitBtn = ({ text }: { text: string }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="flex w-full justify-center rounded-md cursor-pointer text-sm
       bg-gray-200 px-3 py-1.5  font-semibold text-gray-900 italic  hover:bg-gray-300
       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
    >
      {pending && <LoaderCircle className="animate-spin" />}
      {pending ? "Loading..." : text}
    </Button>
  );
};

export default SubmitBtn;
