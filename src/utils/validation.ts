import { object, string } from "zod";

export const tweetSchema = object({
  text: string({
    required_error: "Text is required",
  })
    .min(10)
    .max(200),
});
