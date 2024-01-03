"use client";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

const UpgradeButton = () => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      console.log(url);
      window.location.href = url ?? "/dashboard/billing";
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return (
    <Button className="w-full" onClick={() => createStripeSession()}>
      Upgrade Now
      <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
