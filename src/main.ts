import { App, ExpressReceiver, LogLevel } from "@slack/bolt";
import { PORT, SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from "./config";

const receiver = new ExpressReceiver({ signingSecret: SLACK_SIGNING_SECRET });

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
  receiver,
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

const run = async () => {
  await app.start(PORT);
  console.log(`⚡️ Bolt app is running! > http://localhost:${PORT}`);
};
run();
