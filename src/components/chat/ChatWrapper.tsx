"use client";
import React from "react";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ChatContextProvider } from "@/context/ChatContext";
interface IChatWrapper {
  fileId: string;
}
const ChatWrapper = ({ fileId }: IChatWrapper) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data === "FAILED" || data === "SUCCESS" ? false : 500,
    }
  );

  if (isLoading)
    return (
      <div className="relative min-h-full divide-y divide-border  justify-between gap-2">
        <div
          className="flex-1 flex justify-center flex-col mb-28
      "
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-sm text-muted-foreground">
              we&apos;re Preparing your document
            </p>
          </div>
        </div>
        <ChatInput isDisabled={true} />
      </div>
    );
  if (data === "FAILED")
    return (
      <div className="relative min-h-full flex divide-y divide-muted-foreground justify-between gap-2">
        <div
          className="flex-1 flex justify-center flex-col mb-28
      "
        >
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-destructive " />
            <h3 className="font-semibold text-xl">Too many pages in PDF</h3>
            <p className="text-sm text-muted-foreground">
              Your <span className="font-medium">Free</span> plan only supports
              up to 5 pages / PDF
            </p>
            <div className="flex items-center justify-center flex-col">
              <Link href={"/pricing"} className={cn(buttonVariants(), "mt-2")}>
                <p className="font-semibold">Upgrade now!</p>
              </Link>
              <p className="text-muted-foreground"></p>
              <Link
                href={"/dashboard"}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-2"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                <p className="font-semibold">Back</p>
              </Link>
            </div>
          </div>
        </div>
        <ChatInput isDisabled={true} />
      </div>
    );

  if (data === "PROCESSING")
    return (
      <div className="relative min-h-full flex divide-y divide-muted-foreground justify-between gap-2">
        <div
          className="flex-1 flex justify-center flex-col mb-28
      "
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <h3 className="font-semibold text-xl">Processing...</h3>
            <p className="text-sm text-muted-foreground">
              This Wont&apos;t take long...
            </p>
          </div>
        </div>
        <ChatInput isDisabled={true} />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative max-h-[calc(100vh)-7rem] divide-border flex flex-col justify-between gap-2 divide-y divide-x ">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages fileId={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
