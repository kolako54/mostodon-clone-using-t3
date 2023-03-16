import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "../utils/api";
export const useUpdateCache = ({
  client,
  variables,
  data,
  action,
}: {
  client: QueryClient;
  variables: { tweetId: string };
  data: { userId: string };
  action: "like" | "unlike";
}) => {
  console.log("variables:", variables);
  console.log("data:", data);
  client.setQueryData(
    [
      ["tweet", "timeline"],
      {
        input: {
          limit: 10,
        },
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<
        RouterOutputs["tweet"]["timeline"]
      >;
      const value = action === "like" ? 1 : -1;
      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,

                Likes: action === "like" ? [data.userId] : [],
                _count: {
                  Likes: tweet._count.Likes + value,
                },
              };
            }
            return tweet;
          }),
        };
      });
      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
};
