import { useState } from "react";
import { api } from "../utils/api";
import { tweetSchema } from "../utils/validation";
const CreateTweet = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync } = api.tweet.create.useMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tweetSchema.parse({ text });
    } catch (err) {
      setError(err.messsage);
      return;
    }
    mutateAsync({ text });
  };
  return (
    <>
      {error && JSON.stringify(error)}
      <form onSubmit={handleSubmit}>
        <textarea onChange={(e) => setText(e.target.value)} />
        <div>
          <button type="submit">Tweet</button>
        </div>
      </form>
    </>
  );
};
export default CreateTweet;
