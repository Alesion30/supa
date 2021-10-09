import {
  registerTask,
  showOpenModalMessage,
  showRegisterTaskModal,
  showRegisterTaskModalActionId,
  showRegisterTaskModalCallbackId,
} from "./functions/register-task";
import { app, receiver } from "./plugins/bolt";
import {
  reportTask,
  showReportTaskList,
  task1ReportActionId,
  task2ReportActionId,
  task3ReportActionId,
} from "./functions/report-task";
import { showTaskList } from "./functions/show-task";
import { deleteAllMessage } from "./helpers/delete-message";
import {
  registerUser,
  registerUserActionId,
  showSelfIntroductionMessage,
} from "./functions/show-self-introduction-message";

/** イベント・ルーティングなどを登録 */
export const registerApp = () => {
  app.event("app_home_opened", showSelfIntroductionMessage);

  app.message("register-task", async (props) => {
    // メッセージを削除
    const channel = props.message.channel;
    await deleteAllMessage(channel, props.client);

    // タスク登録用のメッセージを送信
    await showOpenModalMessage(props);
  });
  app.message("report-task", showReportTaskList);
  app.message("show-task", showTaskList);

  // メッセージ削除
  app.message("chat-delete", async ({ client, message }) => {
    try {
      const channel = message.channel;
      await deleteAllMessage(channel, client);
    } catch (err) {
      console.error(err);
    }
  });

  // ユーザー登録
  app.action(registerUserActionId, async (props) => {
    await props.ack();
    await registerUser(props);
  });

  app.action(showRegisterTaskModalActionId, async (props) => {
    await props.ack();
    await showRegisterTaskModal(props);
  });

  app.action(task1ReportActionId, async (props) => {
    await props.ack();
    await reportTask(1)(props);
  });

  app.action(task2ReportActionId, async (props) => {
    await props.ack();
    await reportTask(2)(props);
  });

  app.action(task3ReportActionId, async (props) => {
    await props.ack();
    await reportTask(3)(props);
  });

  // タスク登録
  app.view(showRegisterTaskModalCallbackId, async (props) => {
    await props.ack();
    await registerTask(props);
  });

  receiver.router.get("/connection-test", (_, res) => {
    res.send("yay!");
  });
};
