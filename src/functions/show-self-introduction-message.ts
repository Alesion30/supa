import { deleteAllMessageExceptIntro } from "../helpers/delete-message";
import dayjs from "../plugins/dayjs";
import { setDoc } from "../plugins/firebase";
import { userDocumentRef } from "../schemas/user";
import { AppActionFunction, AppEventFunction } from "../types/bolt";
import { User } from "../types/user";

export const registerUserActionId = "register_user-action_id";

/** 自己紹介 */
export const showSelfIntroductionMessage: AppEventFunction<"app_home_opened"> =
  async ({ say, event, client }) => {
    const user = event.user;

    const history = await client.conversations.history({
      channel: event.channel,
      count: 1,
    });

    if (history.messages?.length === 0) {
      await say({
        text: `<@${user}>さん！初めまして！\n私は、皆さんのタスクを管理するアプリです。\n毎朝今日やるべきタスクについてお聞きし、帰宅する頃にどうだったかお聞きします！\n`,
      });
      await say({
        blocks: [
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
export const registerUser: AppActionFunction = async ({
  body,
  say,
  client,
}) => {
  // ユーザー情報
  const user_id = body.user.id;
  const user_name = "name" in body.user ? body.user.name : body.user.username;

  // 現在時刻
  const now = dayjs();

  const user: User = {
    user_id,
    user_name,
    isSubscribed: true,
    created_at: now.toDate(),
  };

  try {
    await setDoc(userDocumentRef(user_id), user, { merge: true });

    const channel = body.channel!.id!;
    await deleteAllMessageExceptIntro(channel);

    await say({ text: "ありがとうございます！" });
  } catch (err) {
    console.log(err);
    await say({
      text: "すみません、登録に失敗しました、、😢",
    });
  }
};
