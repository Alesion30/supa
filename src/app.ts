import { showBeggingMessage } from "./functions/show-beginning-message";
import {
  registerTask,
  showRegisterTaskModal,
  showRegisterTaskModalActionId,
  showRegisterTaskModalCallbackId,
} from "./functions/register-task";
import { app, receiver } from "./plugins/bolt";
import { supabase } from "./plugins/supabase";
import { User } from "./types/user";
import { reportTask } from "./functions/report-task";

/** イベント・ルーティングなどを登録 */
export const registerApp = () => {
  app.message("register-task", showBeggingMessage);
  app.message("report-task", reportTask);

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

  receiver.router.get("/supabase-test", async (req, res) => {
    let { data, error } = await supabase
      .from<User>("users")
      .select("user_id")
      .eq("user_id", "sample_user_id");

    console.log("data", data);
    console.log("error", error);

    res.send(data);
  });
};
