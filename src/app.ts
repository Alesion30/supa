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
  taskReportActionId,
} from "./functions/report-task";
import { showTaskList } from "./functions/show-task";
import { deleteAllMessage } from "./helpers/delete-message";
import {
  registerUser,
  registerUserActionId,
  showSelfIntroductionMessage,
} from "./functions/show-self-introduction-message";
import { userDocumentRef } from "./schemas/user";
import { getDoc } from "./plugins/firebase";

/** イベント・ルーティングなどを登録 */
export const registerApp = () => {
  app.event("app_home_opened", showSelfIntroductionMessage);

  ////////////////////////////////////////////////////////////////
  // devコマンド
  ////////////////////////////////////////////////////////////////
  app.message("register-task", async (props) => {
    // @ts-ignore
    const user_id = props.message.user as string;

    const doc = await getDoc(userDocumentRef(user_id));
    const user = doc.data();

    // タスク登録用のメッセージを送信
    await showOpenModalMessage(user!);
  });
  app.message("report-task", showReportTaskList);
  app.message("show-task", showTaskList);
  app.message("chat-delete", async ({ message }) => {
    try {
      const channel = message.channel;
      await deleteAllMessage(channel);
    } catch (err) {
      console.error(err);
    }
  });
  ////////////////////////////////////////////////////////////////

  // ユーザー登録
  app.action(registerUserActionId, async (props) => {
    await props.ack();
    await registerUser(props);
  });

  // タスク報告
  app.action(showRegisterTaskModalActionId, async (props) => {
    await props.ack();
    await showRegisterTaskModal(props);
  });
  app.action(new RegExp("^" + taskReportActionId + ".*$"), async (props) => {
    await props.ack();
    await reportTask(props);
  });

  // タスク登録
  app.view(showRegisterTaskModalCallbackId, async (props) => {
    await props.ack();
    await registerTask(props);
  });

  // 接続テスト用
  receiver.router.get("/connection-test", (_, res) => {
    res.send("yay!");
  });
};
