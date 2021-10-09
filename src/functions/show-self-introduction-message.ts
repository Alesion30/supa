import dayjs from "../plugins/dayjs";
import { AppActionFunction, AppEventFunction } from "../types/bolt";

export const registerUserActionId = "register_user-action_id";

/** 自己紹介 */
export const showSelfIntroductionMessage: AppEventFunction<"app_home_opened"> =
  async ({ say, event, client }) => {
    const user = event.user;

    const history = await client.conversations.history({
      channel: event.channel,
      count: 1,
    });
    console.log(history);

    if (history.messages?.length === 0) {
      await say({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${user}>さん！初めまして！\n私は、皆さんのタスクを管理するアプリです。\n毎朝今日やるべきタスクについてお聞きし、帰宅する頃にどうだったかお聞きします！\n`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "毎朝お聞きして良い場合は、右のボタンを押してください！",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "いいよ",
              },
              style: "primary",
              action_id: registerUserActionId,
            },
          },
        ],
      });
    }
  };

/** ユーザー登録 */
export const registerUser: AppActionFunction = async ({ body }) => {
  // ユーザー情報
  const user_id = body["user"]["id"];

  // 現在時刻
  const now = dayjs();

  console.log(user_id);
  console.log(now);
};
