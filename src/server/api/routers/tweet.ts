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
      const tweets = await prisma.tweet.findMany({
        take: limit + 1,
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      return {
        tweets,
      };
    }),
});
