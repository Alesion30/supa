/** メッセージを全削除 */
export const deleteAllMessage = async (channel: string, client: any) => {
  const history = await client.conversations.history({ channel });
  console.log(history);
  history.messages?.forEach((message: any) => {
    const ts = message.ts;
    const user = message.user;
    if (ts && user == "U02G83DQQDV") {
      client.chat.delete({ channel, ts });
    }
  });
};

/** 最初の自己紹介以外のメッセージを全削除 */
export const deleteAllMessageExceptIntro = async (
  channel: string,
  client: any
) => {
  const history = await client.conversations.history({ channel });
  const messages = history.messages ?? [];
  messages.sort((a: any, b: any) => {
    if (a.ts < b.ts) return -1;
    if (a.ts > b.ts) return 1;
    return 0;
  });
  console.log(messages);
  messages.forEach((message: any, index: number) => {
    if (index != 0) {
      const ts = message.ts;
      if (ts) {
        client.chat.delete({ channel, ts });
      }
    }
  });
};
