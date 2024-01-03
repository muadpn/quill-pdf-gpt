import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
// import { DialogContent } from "@radix-ui/react-dialog";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { toast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
interface IPdfFullScreen {
  fileUrl: string;
  errorPDf: React.JSX.Element;
}
const PdfFullScreen = ({ fileUrl, errorPDf }: IPdfFullScreen) => {
  const [isOpen, setIsopen] = useState<boolean>(false);
  const [numPages, setNumbPages] = useState<number>(0);
  const [currPage, setCurrPage] = useState<number>(1);
  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsopen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsopen(true)} asChild>
        <Button
          // onClick={}
          variant={"ghost"}
          aria-label="full screen mode"
        >
          <Expand className="h-4 w-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
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
              file={fileUrl}
              error={errorPDf}
              onError={() => console.log("error")}
              // onLoadError={() => setIsError(true)}
              className="max-h-full"
            >
              {new Array(numPages).fill(0).map((_, i) => {
                return (
                  <Page
                    key={i}
                    width={width ? width : 300}
                    pageNumber={i + 1}
                    className="flex items-center justify-center"
                  />
                );
              })}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
