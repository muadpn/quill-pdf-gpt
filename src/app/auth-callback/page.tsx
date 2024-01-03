"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const { isError, fetchStatus, isLoadingError, failureCount } =
    trpc.authcallback.useQuery(undefined, {
      onSuccess: ({ success }) => {
        console.log(success);
        if (success) {
          // user is synced to db
          router.push(origin ? `/${origin}` : "/dashboard");
        }
      },
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
      },
      retry: true,
      retryDelay: 1500,
    });
  if (failureCount > 3) router.push("/api/auth/register");
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <h3 className="font-semibold text-xl">setting up your account...</h3>
        <p className="text-muted-foreground">
          You will be Redirected Automatically
        </p>
      </div>
    </div>
  );
};

export default Page;
