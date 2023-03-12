import { tweetSchema } from "./../../../utils/validation";
import { createTRPCRouter, protectedProcedure } from "./../trpc";

export const tweetRouter = createTRPCRouter({
  createTweet: protectedProcedure
    .input(tweetSchema)
    .mutation(({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text } = input;
      const userId = session.user.id;
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
});
