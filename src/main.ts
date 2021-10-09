import { registerApp } from "./app";
import { PORT } from "./config";
import { registerCron } from "./cron";
import { app } from "./plugins/bolt";

const run = async () => {
  await app.start(PORT);
  registerApp();
  registerCron();
  console.log(`⚡️ Bolt app is running! > http://localhost:${PORT}`);
};
run();
