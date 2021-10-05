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

const run = async () => {
  await app.start(PORT);
  console.log(`⚡️ Bolt app is running! > http://localhost:${PORT}`);
};
run();
