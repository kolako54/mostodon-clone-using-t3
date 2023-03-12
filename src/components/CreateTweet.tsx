import { useState } from "react";
import { api } from "../utils/api";
import { tweetSchema } from "../utils/validation";
const CreateTweet = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync } = api.tweet.createTweet.useMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tweetSchema.parse({ text });
      mutateAsync({ text });
    } catch (err) {
      setError(err.message);
      return;
    }
  };
  console.log("jeeez", error);
  return (
    <>
      {error && JSON.parse(error)[0].message}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col rounded-md border-2 p-4"
      >
        <textarea
          className="w-full p-4 shadow"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-primary px-2 py-2 text-white"
          >
            Tweet
          </button>
        </div>
      </form>
    </>
  );
};
export default CreateTweet;
