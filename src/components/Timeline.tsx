import { api } from "../utils/api";
import CreateTweet from "./CreateTweet";
const Timeline = () => {
  const tweets = api.tweet.timeline.useQuery({
    limit: 2,
  });
  return (
    <div>
      <CreateTweet />
      {JSON.stringify(tweets)}
    </div>
  );
};
export default Timeline;
