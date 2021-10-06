import { PlainTextInput, TimePickerInput } from "./components/input";
import { app, receiver } from "./plugins/bolt";

/** イベント・ルーティングなどを登録 */
export const registerApp = () => {
  app.message("register-task", async ({ say }) => {
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "今日やらないといけないことを3つまで教えてください！",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "回答する",
            },
            action_id: "register-task-btn",
          },
        },
      ],
    });
  });

  app.action("register-task-btn", async ({ body, ack, client }) => {
    await ack();
    try {
      await client.views.open({
        // @ts-ignore
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: "register-task",
          title: {
            type: "plain_text",
            text: "タスクの登録",
          },
          blocks: [
            PlainTextInput({
              block_id: "task_input_block1",
              action_id: "task_act1",
              label: "1つ目",
              placeholder: "例) #1のissueに取り掛かる",
              multiline: true,
              optional: false,
            }),
            PlainTextInput({
              block_id: "task_input_block2",
              action_id: "task_act2",
              label: "2つ目",
              placeholder: "例) 論文を一つ読む",
              multiline: true,
              optional: true,
            }),
            PlainTextInput({
              block_id: "task_input_block3",
              action_id: "task_act3",
              label: "3つ目",
              placeholder: "例) 懸垂を5回する",
              multiline: true,
              optional: true,
            }),
            TimePickerInput({
              block_id: "task_time_block",
              action_id: "task_time_act",
              label: "帰宅時間（帰宅する頃にリマインドします）",
              initial_time: "17:00",
            }),
          ],
          submit: {
            type: "plain_text",
            text: "登録",
          },
          close: {
            type: "plain_text",
            text: "閉じる",
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  app.view("register-task", async ({ ack, body, client }) => {
    await ack();
    const user = body["user"]["id"];

    try {
      await client.chat.postMessage({
        channel: user,
        text: "タスク登録機能は未実装です",
      });
    } catch (error) {
      console.error(error);
    }
  });

  receiver.router.post("/secret-page", (req, res) => {
    res.send("yay!");
  });
};
