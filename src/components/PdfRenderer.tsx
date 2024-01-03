"use client";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Rotate3dIcon,
  RotateCcwIcon,
  RotateCw,
  RotateCwIcon,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "./ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleBar from "simplebar-react";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

interface IPdfRendererProps {
  url: string;
}
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import PdfFullScreen from "./PdfFullScreen";

const errorPDf = () => (
  <div className="flex-1 w-full p-5">
    <h1 className="text-3xl text-destructive ">Something went wrong!</h1>
    <p className="mt-4 text-xl  ">Posible ways to fix</p>
    <ul className="list-disc list-outside text-mutedforeground  px-6">
      <li className="text-lg text-muted-foreground">
        Try Enabling JavaScript on browser.
      </li>
      <li className="text-lg text-muted-foreground">
        Disable Ad-blocker&apos;s
      </li>
      <li className="text-lg text-muted-foreground">
        Disable or Delete unwanted extension&apos;s
      </li>
      <li className="text-lg text-muted-foreground">
        Try diffrent browser&apos;s, [Chrome, Firefox Developer&apos;s]
        recommended
      </li>
      <li className="text-lg text-muted-foreground">
        Make sure PDF that uploaded is validated.
      </li>
    </ul>
    <p className="max-w-prose font-bold  flex gap-2">
      Note:
      <span className="font-normal text-muted-foreground">
        Brave Browser Normally doesn&apos;t allow to fetch from external
        Sources. Try fixing brave settings.
      </span>
    </p>
  </div>
);

const PdfRenderer = ({ url }: IPdfRendererProps) => {
  const [numPages, setNumbPages] = useState<number>(0);
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  // const [isLoading, setisLoading] = useState<boolean>(false);
  const [renderedScale, setrenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages),
  });
  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });
  const { width, ref } = useResizeDetector();
  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="w-full bg-primary-foreground rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-border flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => {
              setCurrPage((prev) => (prev - 1 < 1 ? 1 : prev - 1));
              setValue("page", String(currPage - 1));
            }}
            disabled={currPage <= 1 ? true : false}
            aria-label="Previos Page"
            variant="ghost"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(handlePageSubmit)();
              }}
              className={cn("w-12 h-8", {
                "focus-visible:ring-destructive": errors.page,
              })}
            />
            <p className="text-muted-foreground text-lg space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > numPages ? numPages : prev + 1
              );
              setValue("page", String(currPage + 1));
            }}
            disabled={currPage === numPages || currPage > numPages}
            aria-label="Next Page"
            variant="ghost"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-1.5"
                aria-label="Zoom Drop down "
                variant={"ghost"}
              >
                <Search className="h-4 w-4" />
                {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(0.25)}>
                25%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.5)}>
                50%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.75)}>
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100% default
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant={"ghost"}
            aria-label="rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <PdfFullScreen errorPDf={errorPDf()} fileUrl={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh)-10rem]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumbPages(numPages)}
              onLoadError={() => {
                toast({
                  title: "Error Loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              externalLinkTarget="_blank"
              file={url}
              error={errorPDf}
              onError={() => console.log("error")}
              // onLoadError={() => setIsError(true)}
              className="max-h-full "
            >
              {isLoading && renderedScale ? (
                <Page
                  className="flex items-center justify-center"
                  scale={scale}
                  width={width ? width : 300}
                  pageNumber={currPage}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}

              <Page
                className={cn(
                  isLoading ? "hidden" : "",
                  "flex items-center justify-center"
                )}
                scale={scale}
                key={"@" + scale}
                width={width ? width : 300}
                pageNumber={currPage}
                rotate={rotation}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 w-6 h-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setrenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
