import { schedule } from "node-cron";

/** cron処理を登録 */
export const registerCron = () => {
  schedule("* * * * *", () => console.log("hello"));
};
