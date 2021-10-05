import { App } from "@slack/bolt";
import { PORT } from "./config";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message("hello-test", async ({ message, say }) => {
  console.log("hello-test");
  console.log("message", message);
  say("Hello World!");
});

app.message("hello-test2", async ({ message, say }) => {
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Hello!"
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "action_id": "hello-test2-btn"
          }
        }
      ],
    });
});

app.action("hello-test2-btn", async ({ body, ack, say }) => {
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
  });

const run = async () => {
  await app.start(PORT);
  console.log(`⚡️ Bolt app is running! > http://localhost:${PORT}`);
};
run();
