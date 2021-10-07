import { TaskReportBlocks } from "../components/task-report";
import dayjs from "../plugins/dayjs";
import { TASK_TABLE } from "../plugins/supabase";
import { AppMessageFunction } from "../types/bolt";

// タスクID
export const task1ReportBlockId = "report_task1-block_id";
export const task1ReportActionId = "report_task1-action_id";
export const task2ReportBlockId = "report_task2-block_id";
export const task2ReportActionId = "report_task2-action_id";
export const task3ReportBlockId = "report_task3-block_id";
export const task3ReportActionId = "report_task3-action_id";

/** タスク報告 */
export const reportTask: AppMessageFunction = async ({ say, message }) => {
  // @ts-ignore
  const user_id = message.user as string;

  try {
    const { data, error } = await TASK_TABLE.select("*")
      .eq("user_id", user_id)
      .gte("created_at_unix", dayjs().startOf("d").unix())
      .lte("created_at_unix", dayjs().endOf("d").unix());

    if (error) throw new Error();

    if (data != null && data.length > 0) {
      const task1 = data.find((v) => v.number == 1) ?? null;
      const task2 = data.find((v) => v.number == 2) ?? null;
      const task3 = data.find((v) => v.number == 3) ?? null;

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
