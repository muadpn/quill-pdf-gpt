"use client";
import React from "react";
import { DropdownMenu } from "./ui/dropdown-menu";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { Icons } from "./Icons";
import { DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import Link from "next/link";
import { Gem } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
interface IUserAccountNav {
  email: string | undefined;
  name: string;
  imageUrl: string;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}
const UserAccountNav = ({
  email,
  imageUrl,
  name,
  subscriptionPlan,
}: IUserAccountNav) => {
  // const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="overflow-visible" asChild>
          <Button className="rounded-full h-8 w-8 aspect-square ">
            <Avatar className="relative h-8 w-8">
              {imageUrl ? (
                <div className="relative aspect-square h-full w-full">
                  <Image
                    fill
                    alt="profile picture"
                    referrerPolicy="no-referrer"
                    src={imageUrl}
                  />
                </div>
              ) : (
                <AvatarFallback className="">
                  <span className="sr-only">{name}</span>
                  <Icons.user className="  h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5 leading-none">
              {name ? <p className="font-medium text-sm ">{name}</p> : null}
              {email ? (
                <p className="w-[200px] truncate text-xs text-muted-foreground">
                  {email}
                </p>
              ) : null}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            {subscriptionPlan.isSubscribed ? (
              <Link href={"/dashboard/billing"}>Manage Subscription</Link>
            ) : (
              <Link href={"/pricing"}>
                Upgrade <Gem className="text-primary h-4 w-4 ml-1.5" />
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <LogoutLink>Log out</LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAccountNav;
