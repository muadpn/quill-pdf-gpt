"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import {
  GhostIcon,
  Loader2,
  MessageSquare,
  Plus,
  TrashIcon,
  XOctagon,
} from "lucide-react";
// import { UploadButton } from "./UploadButton";
// import Skeleton from "react-loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { format } from "date-fns";
const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);
  const utils = trpc.useUtils();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile, isLoading: DeletingFile } =
    trpc.deleteFiles.useMutation({
      onSuccess: () => {
        utils.getUserFiles.invalidate();
      },
      onMutate: ({ id }) => setCurrentlyDeletingFile(id),
      onSettled: () => setCurrentlyDeletingFile(null),
    });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-border pb-5 sm:flex-row  sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-foreground">My Files</h1>
        {/* <Button>Upload file</Button> */}
        <UploadButton />
      </div>
      {/* Display All User Files */}
      {files && files.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-border md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getDate() -
                new Date(a.createdAt).getDate()
            )
            .map((file) => {
              return (
                <li
                  key={file.id}
                  className="col-span-1 rounded-md divide-y divide-border border bg-card shadow transition hover:shadow-lg"
                >
                  <Link
                    className="flex gap-2 flex-col"
                    href={`/dashboard/${file.id}`}
                  >
                    <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6 ">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-accent-foreground to-accent"></div>
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium ">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />{" "}
                      {format(new Date(file.createdAt), "MMM yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Mocked 
                    </div>
                    <Button
                      onClick={() => deleteFile({ id: file.id })}
                      variant="destructive"
                      size={"sm"}
                      className="bg-destructive/80 w-full"
                    >
                      {currentlyDeletingFile === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </li>
              );
            })}
        </ul>
      ) : isLoading ? (
        <MaxWidthWrapper className="mt-8 grid grid-cols-1 gap-6 divide-y divide-border md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-60 w-full md:max-w-72 rounded-md mt-2" />
          <Skeleton className="h-60 w-full md:max-w-72 rounded-md mt-2" />
          <Skeleton className="h-60 w-full md:max-w-72 rounded-md mt-2" />
          <Skeleton className="h-60 w-full md:max-w-72 rounded-md mt-2" />
          <Skeleton className="h-60 w-full md:max-w-72 rounded-md mt-2" />
          <Skeleton className="h-60 w-full md:max-w-72 rounded-md mt-2" />
        </MaxWidthWrapper>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <GhostIcon className="h-8 w-8 text-muted-foreground" />
          <h3 className="font-semibold text-xl ">Pretty Empty around here</h3>
          <p>Let&apos;s upload your first PDF</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
