import {
  query,
  where,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";
import { TaskListBlocks } from "../components/task-list";
import dayjs from "../plugins/dayjs";
import { taskCollectionRef } from "../schemas/task";
import { AppMessageFunction } from "../types/bolt";
import { Task } from "../types/task";

/** 登録されているタスク一覧を表示 */
export const showTaskList: AppMessageFunction = async ({ say, message }) => {
  // ユーザー情報
  // @ts-ignore
  const user_id = message.user;

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
        blocks: TaskListBlocks({ user: user_id, task1, task2, task3 }),
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
