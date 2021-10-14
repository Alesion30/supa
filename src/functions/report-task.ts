import {
  query,
  where,
  startAt,
  endAt,
  getDocs,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { Divider } from "../components/divider";
import { TaskReportBlock } from "../components/task-report";
import dayjs from "../plugins/dayjs";
import { taskCollectionRef, taskDocumentRef } from "../schemas/task";
import { AppActionFunction, AppMessageFunction } from "../types/bolt";
import { Task } from "../types/task";

// タスクID
export const taskReportBlockId = "report_task-block_id";
export const taskReportActionId = "report_task-action_id";

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
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${user_id}>さん！今日もお疲れ様でした！タスクの進捗はいかがでしたか？`,
            },
          },
          Divider,
        ],
      });

      if (task1?.id != undefined && task1?.content != null) {
        await say({
          blocks: TaskReportBlock({
            task: task1,
            block_id: `${taskReportBlockId}_${task1?.id}`,
            action_id: `${taskReportActionId}_${task1?.id}`,
          }),
        });
      }

      if (task2?.id != undefined && task2?.content != null) {
        await say({
          blocks: TaskReportBlock({
            task: task2,
            block_id: `${taskReportBlockId}_${task2?.id}`,
            action_id: `${taskReportActionId}_${task2?.id}`,
          }),
        });
      }

      if (task3?.id != undefined && task3?.content != null) {
        await say({
          blocks: TaskReportBlock({
            task: task3,
            block_id: `${taskReportBlockId}_${task3?.id}`,
            action_id: `${taskReportActionId}_${task3?.id}`,
          }),
        });
      }
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
export const reportTask: AppActionFunction = async ({ body, say }) => {
  // @ts-ignore
  const values = body["state"]["values"];
  console.log(values);

  try {
    for (let block_id in values) {
      for (let action_id in values[block_id]) {
        const value = values[block_id][action_id].selected_option
          .value as string;
        const ary = value.split(":");
        if (ary.length == 2) {
          const task_id = ary[0];
          const achievement = parseInt(ary[1]);
          await setDoc(
            taskDocumentRef(task_id),
            { achievement },
            { merge: true }
          );
        }
        break;
      }
      break;
    }
  } catch (err) {
    await say({
      text: "すみません、タスクの更新に失敗しました、、😢",
    });
  }
};
