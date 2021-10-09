import { schedule } from "node-cron";
import { showOpenModalMessage } from "./functions/register-task";

/** cron処理を登録 */
export const registerCron = () => {
  // 毎日9時にタスクについて聞く
  schedule("15 13 * * *", showOpenModalMessage);
};
