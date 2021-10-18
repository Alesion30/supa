import { schedule } from "node-cron";
import { showOpenModalMessage } from "./functions/register-task";
import { getDocs, query, where } from "./plugins/firebase";
import { userCollectionRef } from "./schemas/user";

/** cron処理を登録 */
export const registerCron = () => {
  // 毎日9時にタスクについて聞く
  const ask = schedule("0 9 * * *", async () => {
    const queryRef = query(
      userCollectionRef,
      where("is_subscribed", "==", true)
    );
    const querySnapshot = await getDocs(queryRef);
    const docs = querySnapshot.docs;
    docs.forEach(async (doc) => {
      const user = doc.data();
      await showOpenModalMessage(user);
    });
  });
  ask.start();
};
