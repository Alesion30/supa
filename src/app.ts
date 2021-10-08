import { showBeggingMessage } from "./functions/show-beginning-message";
import {
  registerTask,
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

/** イベント・ルーティングなどを登録 */
export const registerApp = () => {
  app.message("register-task", showBeggingMessage);
  app.message("report-task", showReportTaskList);

  // メッセージ削除
  app.message("chat-delete", async ({ client, message }) => {
    try {
      const channel = message.channel;
      const history = await client.conversations.history({ channel });
      console.log(history);
      history.messages?.forEach((message) => {
        const ts = message.ts;
        const user = message.user;
        if (ts && user == "U02G83DQQDV") {
          client.chat.delete({ channel, ts });
        }
      });
    } catch (err) {
      console.error(err);
    }
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

  app.view(showRegisterTaskModalCallbackId, async (props) => {
    await props.ack();
    await registerTask(props);
  });

  receiver.router.get("/connection-test", (_, res) => {
    res.send("yay!");
  });
};
