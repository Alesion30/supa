import { PlainTextInput, TimePickerInput } from "../components/input";
import dayjs from "../plugins/dayjs";
import { TASK_TABLE } from "../plugins/supabase";
import { AppActionFunction, AppViewFunction } from "../types/bolt";

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

  try {
    const { data, error } = await TASK_TABLE.select("*")
      .eq("user_id", user_id)
      .gte("created_at_unix", dayjs().startOf("d").unix())
      .lte("created_at_unix", dayjs().endOf("d").unix());

    if (error) throw new Error();
    if (data == null) throw new Error();

    if (data.length == 0) {
      // 値 values
      const values = view["state"]["values"];

      // タスク
      const task1 = values[task1BlockId][task1ActionId].value;
      const task2 = values[task2BlockId][task2ActionId].value;
      const task3 = values[task3BlockId][task3ActionId].value;

      // リマインド時間（帰宅時間）
      const remindTime =
        values[remindTimeBlockId][remindTimeActionId].selected_time;
      console.log("帰宅時間:", remindTime);

      // 今日のタスクを追加
      const now_unix = dayjs().unix();
      const { error } = await TASK_TABLE.insert([
        { content: task1, number: 1, user_id, created_at_unix: now_unix },
        { content: task2, number: 2, user_id, created_at_unix: now_unix },
        { content: task3, number: 3, user_id, created_at_unix: now_unix },
      ]);
      if (error) throw new Error();

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
    await client.chat.postMessage({
      channel: user_id,
      text: "すみません、タスクの登録に失敗しました、、😢",
    });
  }
};
