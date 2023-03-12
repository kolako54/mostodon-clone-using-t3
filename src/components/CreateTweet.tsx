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
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col rounded-md border-2 p-4"
      >
        <textarea className="shadow p-4 w-full" onChange={(e) => setText(e.target.value)} />
        <div className="mt-4 flex justify-end">
          <button type="submit" className="bg-primary text-white rounded-md px-2 py-2">Tweet</button>
        </div>
      </form>
    </>
  );
};
export default CreateTweet;
