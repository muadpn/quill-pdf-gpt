"use client";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import React from "react";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
export interface IBillingForm {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}
const BillingForm = ({ subscriptionPlan }: IBillingForm) => {
  const { toast } = useToast();
  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        return toast({
          title: "There was a problem...",
          description: "Please Try again in a moment",
          variant: "destructive",
        });
      },
    });
  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the
              <strong> {subscriptionPlan.name}</strong> Plan.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}

              <p className="font-bold">
                {subscriptionPlan.isSubscribed
                  ? "Manage Subscription"
                  : "Upgrade to Pro"}
              </p>
            </Button>
            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renewed on"}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.mm.yyyy")}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
