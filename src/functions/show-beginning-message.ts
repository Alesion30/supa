import { AppMessageFunction } from "../types/bolt";
import { showRegisterTaskModalActionId } from "./register-task";

/** 1日の初めのメッセージ */
export const showBeggingMessage: AppMessageFunction = async ({ say, message }) => {
  // @ts-ignore
  const user = message.user;

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${user}>さん！今日やらないといけないことを3つまで教えてください！`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "回答する",
          },
          action_id: showRegisterTaskModalActionId,
        },
      },
    ],
  });
};
