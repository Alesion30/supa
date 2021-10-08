import {
  query,
  where,
  startAt,
  endAt,
  getDocs,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { TaskReportBlocks } from "../components/task-report";
import dayjs from "../plugins/dayjs";
import { taskCollectionRef, taskDocumentRef } from "../schemas/task";
import { AppActionFunction, AppMessageFunction } from "../types/bolt";
import { Task } from "../types/task";

// タスクID
export const task1ReportBlockId = "report_task1-block_id";
export const task1ReportActionId = "report_task1-action_id";
export const task2ReportBlockId = "report_task2-block_id";
export const task2ReportActionId = "report_task2-action_id";
export const task3ReportBlockId = "report_task3-block_id";
export const task3ReportActionId = "report_task3-action_id";

/** タスク一覧表示 */
export const showReportTaskList: AppMessageFunction = async ({
  say,
  message,
}) => {
  // @ts-ignore
  const user_id = message.user as string;

  // 現在時刻
  const now = dayjs();

  try {
    // 本日のタスクを取得する
    const queryRef = query(
      taskCollectionRef,
      where("user_id", "==", user_id),
      orderBy("created_at"),
      startAt(now.startOf("d").toDate()),
      endAt(now.endOf("d").toDate())
    );
    const querySnapshot = await getDocs(queryRef);
    const docs = querySnapshot.docs;
    const tasks: Task[] = docs.map((doc) => doc.data());

    if (tasks != null && tasks.length > 0) {
      const task1 = tasks.find((v) => v.number == 1) ?? null;
      const task2 = tasks.find((v) => v.number == 2) ?? null;
      const task3 = tasks.find((v) => v.number == 3) ?? null;

      await say({
        blocks: TaskReportBlocks({ user: user_id, task1, task2, task3 }),
      });
    } else {
      await say({
        text: "本日のタスクはまだ設定されていません。",
      });
    }
  } catch (err) {
    await say({
      text: "すみません、タスクの表示に失敗しました、、😢",
    });
  }
};

/** タスクの完了報告処理 */
export const reportTask: (task_num: 1 | 2 | 3) => AppActionFunction =
  (task_num) =>
  async ({ body, say }) => {
    // @ts-ignore
    const values = body["state"]["values"];

    try {
      let value: string; // expect: `${task_id}:${answer_val}`
      switch (task_num) {
        case 1:
          value =
            values[task1ReportBlockId][task1ReportActionId].selected_option
              .value;
          break;
        case 2:
          value =
            values[task2ReportBlockId][task2ReportActionId].selected_option
              .value;
          break;
        case 3:
          value =
            values[task3ReportBlockId][task3ReportActionId].selected_option
              .value;
          break;
      }

      const ary = value.split(":");
      if (ary.length == 2) {
        const task_id = ary[0];
        const achievement = parseInt(ary[1]);
        console.log("task_id", task_id);
        console.log("achievement", achievement);
        await setDoc(
          taskDocumentRef(task_id),
          { achievement },
          { merge: true }
        );
      }
    } catch (err) {
      await say({
        text: "すみません、タスクの更新に失敗しました、、😢",
      });
    }
  };
