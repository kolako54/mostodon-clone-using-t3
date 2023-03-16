import Image from "next/image";
import { api } from "../utils/api";
import { AiFillHeart } from "react-icons/ai";
import type { RouterOutputs } from "../utils/api";
import dayjs from "../utils/dayjs";
import { useUpdateCache } from "../hooks/UpdateCache";
import type { QueryClient } from "@tanstack/react-query";

const Tweet = ({
  tweet,
  client,
}: {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
  client: QueryClient;
}) => {
  const likeMutation = api.tweet.like.useMutation({
    onSuccess: (data, variables) => {
      useUpdateCache({ client, data, variables, action: "like" });
    },
  }).mutateAsync;
  const unlikeMutation = api.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      useUpdateCache({ client, data, variables, action: "unlike" });
    },
  }).mutateAsync;
  const hasLiked = tweet.Likes.length > 0;
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
      <div className="mt-4 flex items-center p-2">
        <AiFillHeart
          color={hasLiked ? "red" : "gray"}
          size="1.5rem"
          onClick={() => {
            if (hasLiked) {
              unlikeMutation({
                tweetId: tweet.id,
              });
              return;
            }
            likeMutation({
              tweetId: tweet.id,
            });
          }}
        />
        <span className="text-sm text-gray-500">{tweet._count.Likes}</span>
      </div>
    </div>
  );
};
export default Tweet;
