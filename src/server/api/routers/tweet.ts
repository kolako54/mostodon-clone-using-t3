import { object, z } from "zod";
import { tweetSchema } from "./../../../utils/validation";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "./../trpc";

export const tweetRouter = createTRPCRouter({
  createTweet: protectedProcedure
    .input(tweetSchema)
    .mutation(({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text } = input;
      const userId = session.user.id;
      console.log("This is session:", session.user);
      return prisma.tweet.create({
        data: {
          text,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  timeline: publicProcedure
    .input(
      object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { limit, cursor } = input;
      const userId = ctx.session?.user?.id;
      const tweets = await prisma.tweet.findMany({
        take: limit + 1,
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          Likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          author: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
          _count: {
            select: {
              Likes: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (tweets.length > limit) {
        const nextItem = tweets.pop() as (typeof tweets)[number];
        nextCursor = nextItem.id;
      }
      return {
        tweets,
        nextCursor,
      };
    }),
  like: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;
      return prisma.like.create({
        data: {
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      console.log("this is session user id:", userId);
      const { prisma } = ctx;
      return prisma.like.delete({
        where: {
          tweetId_userId: {
            userId,
            tweetId: input.tweetId,
          },
        },
      });
    }),
});
