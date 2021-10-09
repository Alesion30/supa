import { app } from "../plugins/bolt";

/** メッセージを全削除 */
export const deleteAllMessage = async (channel: string) => {
  const history = await app.client.conversations.history({ channel });
  console.log(history);
  history.messages?.forEach((message: any) => {
    const ts = message.ts;
    const user = message.user;
    if (ts && user == "U02G83DQQDV") {
      app.client.chat.delete({ channel, ts });
    }
  });
};

/** 最初の自己紹介以外のメッセージを全削除 */
export const deleteAllMessageExceptIntro = async (
  channel: string
) => {
  const history = await app.client.conversations.history({ channel });
  const messages = history.messages ?? [];
  messages.sort((a, b) => {
    if (a.ts != undefined && b.ts != undefined) {
      if (a.ts < b.ts) return -1;
      if (a.ts > b.ts) return 1;
    }
    return 0;
  });
  messages.forEach((message, index) => {
    if (index != 0) {
      const ts = message.ts;
      if (ts) {
        app.client.chat.delete({ channel, ts });
      }
    }
  });
};
