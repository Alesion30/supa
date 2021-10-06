import { showBeggingMessage } from "./functions/show-beginning-message";
import {
  registerTask,
  showRegisterTaskModal,
  showRegisterTaskModalActionId,
  showRegisterTaskModalCallbackId,
} from "./functions/register-task";
import { app, receiver } from "./plugins/bolt";

/** イベント・ルーティングなどを登録 */
export const registerApp = () => {
  app.message("register-task", showBeggingMessage);

  app.action(showRegisterTaskModalActionId, async (props) => {
    await props.ack();
    await showRegisterTaskModal(props);
  });

  app.view(showRegisterTaskModalCallbackId, async (props) => {
    await props.ack();
    await registerTask(props);
  });

  receiver.router.get("/connection-test", (req, res) => {
    res.send("yay!");
  });
};
