import { app, receiver } from "./plugins/bolt";

/** イベント・ルーティングなどを登録 */
export const registerApp = () => {
  app.message("hello-test1", async ({ message, say }) => {
    console.log("hello-test");
    console.log("message", message);
    say("Hello World!");
  });

  app.message("hello-test2", async ({ message, say }) => {
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Hello!",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Click Me",
            },
            action_id: "hello-test2-btn",
          },
        },
      ],
    });
  });

  app.action("hello-test2-btn", async ({ body, ack, say }) => {
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
  });

  receiver.router.post("/secret-page", (req, res) => {
    res.send("yay!");
  });
};
