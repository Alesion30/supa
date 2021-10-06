import { App, ExpressReceiver, LogLevel } from "@slack/bolt";
import { SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN } from "../config";

export const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
});

export const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
  receiver,
});
