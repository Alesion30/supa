import { PlainTextInput, TimePickerInput } from "../components/input";
import dayjs from "../plugins/dayjs";
import {
  addDoc,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "../plugins/firebase";
import { taskCollectionRef } from "../schemas/task";
import { AppActionFunction, AppViewFunction } from "../types/bolt";
import { Task } from "../types/task";

/** アクションID */
export const showRegisterTaskModalActionId =
  "show_register_task_modal-action_id";

/** コールバックID */
export const showRegisterTaskModalCallbackId =
  "show_register_task_modal-callback_id";

// タスクID
export const task1BlockId = "register_task1-block_id";
export const task1ActionId = "register_task1-action_id";
export const task2BlockId = "register_task2-block_id";
export const task2ActionId = "register_task2-action_id";
export const task3BlockId = "register_task3-block_id";
export const task3ActionId = "register_task3-action_id";
export const remindTimeBlockId = "remind_time-block_id";
export const remindTimeActionId = "remind_time-action_id";

/** タスクを登録するためのモーダルを表示 */
export const showRegisterTaskModal: AppActionFunction = async ({
  body,
  client,
}) => {
  try {
    await client.views.open({
      // @ts-ignore
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: showRegisterTaskModalCallbackId,
        title: {
          type: "plain_text",
          text: "本日のタスク登録",
        },
        blocks: [
          PlainTextInput({
            block_id: task1BlockId,
            action_id: task1ActionId,
            label: "1つ目",
            placeholder: "例) #1のissueに取り掛かる",
            multiline: true,
            optional: false,
          }),
          PlainTextInput({
            block_id: task2BlockId,
            action_id: task2ActionId,
            label: "2つ目",
            placeholder: "例) 論文を一つ読む",
            multiline: true,
            optional: true,
          }),
          PlainTextInput({
            block_id: task3BlockId,
            action_id: task3ActionId,
            label: "3つ目",
            placeholder: "例) 懸垂を5回する",
            multiline: true,
            optional: true,
          }),
          TimePickerInput({
            block_id: remindTimeBlockId,
            action_id: remindTimeActionId,
            label: "帰宅時間（帰宅する頃にタスクの状況についてお聞きします）",
            initial_time: "17:00",
          }),
        ],
        submit: {
          type: "plain_text",
          text: "登録",
        },
        close: {
          type: "plain_text",
          text: "閉じる",
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};

/** タスク情報をデータベースに登録 */
export const registerTask: AppViewFunction = async ({ body, client, view }) => {
  // ユーザー情報
  const user_id = body["user"]["id"];

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

    if (docs.length == 0) {
      // 値 values
      const values = view["state"]["values"];

      // タスク
      const task1 = values[task1BlockId][task1ActionId].value ?? null;
      const task2 = values[task2BlockId][task2ActionId].value ?? null;
      const task3 = values[task3BlockId][task3ActionId].value ?? null;

      // リマインド時間（帰宅時間）
      const remindTime =
        values[remindTimeBlockId][remindTimeActionId].selected_time;

      // 今日のタスクを追加
      const tasks: Task[] = [
        {
          content: task1,
          achievement: 0,
          number: 1,
          user_id: user_id,
          created_at: now.toDate(),
        },
        {
          content: task2,
          achievement: 0,
          number: 2,
          user_id: user_id,
          created_at: now.toDate(),
        },
        {
          content: task3,
          achievement: 0,
          number: 3,
          user_id: user_id,
          created_at: now.toDate(),
        },
      ];
      tasks.forEach(async (task) => {
        await addDoc(taskCollectionRef, task);
      });

      await client.chat.postMessage({
        channel: user_id,
        text: `登録しました！\n${remindTime}にリマインドしますね！`,
      });
    } else {
      await client.chat.postMessage({
        channel: user_id,
        text: "今日の分はもう登録されていますよ",
      });
    }
  } catch (error) {
    console.log(error);
    await client.chat.postMessage({
      channel: user_id,
      text: "すみません、タスクの登録に失敗しました、、😢",
    });
  }
};
