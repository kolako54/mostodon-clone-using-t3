import { api } from "../utils/api";
import CreateTweet from "./CreateTweet";
import { useEffect } from "react";
import { useScrollPosition } from "../hooks/ScrollPosition";
import Tweet from "./Tweet";
import { useQueryClient } from "@tanstack/react-query";

const Timeline = () => {
  const scrollPosition = useScrollPosition();
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweet.timeline.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const client = useQueryClient();
  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];
  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition]);
  // console.log({ scrollPosition });
  return (
    <div>
      <CreateTweet />
      <div className="border-l-2 border-r-2 border-t-2 border-gray-500">
        {tweets.map((tweet) => {
          return <Tweet key={tweet.id} tweet={tweet} client={client} />;
        })}
        {!hasNextPage && <p>No more items to load</p>}
      </div>
    </div>
  );
};
export default Timeline;
