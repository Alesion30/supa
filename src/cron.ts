import { schedule } from "node-cron";
import { app } from "./plugins/bolt";
import { getDocs, query, where } from "./plugins/firebase";
import { userCollectionRef } from "./schemas/user";

/** cron処理を登録 */
export const registerCron = () => {
  schedule("15 12 * * *", async () => {
    const queryRef = query(
      userCollectionRef,
      where("isSubscribed", "==", true)
    );
    const querySnapshot = await getDocs(queryRef);
    const docs = querySnapshot.docs;
    docs.forEach((doc) => {
      const user = doc.data();
      app.client.chat.postMessage({
        channel: user.user_id,
        text: "テストメッセージ",
      });
    });
  });
};
