"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import React from "react";
import { CloudIcon, File, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
const UploadDropzone = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader"
  );
  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 700);
    return interval;
  };
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });
  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        //handle file uploading..
        const res = await startUpload(acceptedFiles);
        if (!res) {
          return toast({
            title: "Something went wrong",
            description: "Error uploading pdf, Please try again later!",
            variant: "destructive",
          });
        }
        const [fileResponse] = res;
        const key = fileResponse?.key;
        if (!key) {
          return toast({
            title: "Something went wrong",
            description: "Error uploading pdf, Please try again later!",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div {...getRootProps()} className=" h-64 m-4  ">
          <div className="flex items-center border border-dashed rounded-lg bg-primary-foreground  justify-center h-full w-full">
            <input {...getInputProps()} />
            <label
              htmlFor="dropzone-file"
              className="flex flex-col   items-center justify-center w-full h-full  cursor-pointer   "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudIcon className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold"> Click to Upload</span>
                  {` `} or Drag and Drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF (up to {isSubscribed ? "16" : "4"}MB)
                </p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs flex items-center rounded-md overflow-hidden outline outline-[1px] outline-muted divide-x">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-primary" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500/20" : ""
                    }
                    className="h-1 w-full"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-muted-foreground text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v: boolean) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
