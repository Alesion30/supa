import { registerApp } from "./app";
import { PORT } from "./config";
import { app } from "./plugins/bolt";

const run = async () => {
  await app.start(PORT);
  registerApp();
  console.log(`⚡️ Bolt app is running! > http://localhost:${PORT}`);
};
run();
