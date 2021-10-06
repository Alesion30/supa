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
            {
              type: "input",
              block_id: "task_input_block1",
              label: {
                type: "plain_text",
                text: "1つ目",
              },
              element: {
                type: "plain_text_input",
                action_id: "task_act1",
                multiline: true,
                placeholder: {
                  type: "plain_text",
                  text: "例) #1のissueに取り掛かる",
                },
              },
            },
            {
              type: "input",
              block_id: "task_input_block2",
              label: {
                type: "plain_text",
                text: "2つ目",
              },
              element: {
                type: "plain_text_input",
                action_id: "task_act2",
                multiline: true,
                placeholder: {
                  type: "plain_text",
                  text: "例) 論文を一つ読む",
                },
              },
              optional: true,
            },
            {
              type: "input",
              block_id: "task_input_block3",
              label: {
                type: "plain_text",
                text: "3つ目",
              },
              element: {
                type: "plain_text_input",
                action_id: "task_act3",
                multiline: true,
                placeholder: {
                  type: "plain_text",
                  text: "例) 昼ごはんをちゃんと食べる",
                },
              },
              optional: true,
            },
          ],
          submit: {
            type: "plain_text",
            text: "登録",
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
