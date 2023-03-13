import { api } from "../utils/api";
import type { RouterOutputs } from "../utils/api";
import CreateTweet from "./CreateTweet";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dh",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});
const Tweet = ({
  tweet,
}: {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
}) => {
  return (
    <div className="mb-4 border-b-2 border-gray-500">
      <div className="flex p-2">
        {tweet.author.image && (
          <Image
            src={tweet.author.image}
            alt={`${tweet.author.name} profile picture`}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div className="ml-2">
          <div className="align-center flex">
            <p className="font-bold">{tweet.author.name}</p>
            <p className="text-sm text-gray-400">
              - {dayjs(tweet.createdAt).fromNow()}
            </p>
          </div>
          <div>{tweet.text}</div>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const {data, hasNextPage, fetchNextPage, isFetching} = api.tweet.timeline.useInfiniteQuery({
    limit: 10,
  },
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
  const tweets = data?.pages.flatMap((page) => page.tweets) ?? []
  console.log("dataaa", data);
  return (
    <div>
      <CreateTweet />
      <div className="border-l-2 border-r-2 border-t-2 border-gray-500">
        {tweets.map((tweet) => {
          return <Tweet key={tweet.id} tweet={tweet} />;
        })}
        <button onClick={() => void fetchNextPage()} disabled={!hasNextPage || isFetching}>load next</button>
      </div>
    </div>
  );
};
export default Timeline;
