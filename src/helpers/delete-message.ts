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
  console.log(history);
  history.messages?.forEach((message: any, index: number) => {
    if (index != 0) {
      const ts = message.ts;
      const user = message.user;
      if (ts && user == "U02G83DQQDV") {
        client.chat.delete({ channel, ts });
      }
    }
  });
};
