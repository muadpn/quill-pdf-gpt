import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { string, z } from "zod";
import { $Enums } from "@prisma/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { PLANS } from "@/config/stripe";
export const appRouter = router({
  authcallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || !user?.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { user, userId } = ctx;

    const data = await db.file.findMany({
      where: {
        userId: userId,
      },
    });
    // console.log(data)
    return data;
  }),
  deleteFiles: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });
      if (!file) new TRPCError({ code: "NOT_FOUND" });
      await db.file.delete({
        where: {
          id: input.id,
        },
      });
      return file;
    }),
  getFile: privateProcedure
    .input(z.object({ key: string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId: userId,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });
      if (!file) return { status: "PENDING" as const };

      return file.uploadStatus;
    }),
  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;
      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl("/dashboard/billing");
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();
    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      try {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: dbUser.id,
          return_url: billingUrl,
        });
        return {
          url: stripeSession.url,
        };
      } catch (error) {
        console.log(error);
      }
    }
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "required",
      line_items: [
        {
          price: PLANS.find((p) => p.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return {
      url: stripeSession.url,
    };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
