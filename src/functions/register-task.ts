import { PlainTextInput, TimePickerInput } from "../components/input";
import { TaskReportBlock } from "../components/task-report";
import { app } from "../plugins/bolt";
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
import { User } from "../types/user";
import { taskReportActionId, taskReportBlockId } from "./report-task";

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

/** 1日の初めのメッセージ */
export const showOpenModalMessage = async (user: User) => {
  await app.client.chat.postMessage({
    channel: user.user_id,
    text: "",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${user.user_id}>さん！今日やらないといけないことを3つまで教えてください！`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "回答する",
          },
          action_id: showRegisterTaskModalActionId,
        },
      },
    ],
  });
};

/** タスクを登録するためのモーダルを表示 */
export const showRegisterTaskModal: AppActionFunction = async ({
  body,
  client,
  say,
}) => {
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
    } else {
      await say({
        text: "今日の分はもう登録されていますよ",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

/** タスク情報をデータベースに登録 */
export const registerTask: AppViewFunction = async ({ body, client, view }) => {
  // ユーザー情報
  const user_id = body["user"]["id"];

  // 現在時刻
  const now = dayjs();

  try {
    // 値 values
    const values = view["state"]["values"];

    // タスク
    const task1_val = values[task1BlockId][task1ActionId].value ?? null;
    const task2_val = values[task2BlockId][task2ActionId].value ?? null;
    const task3_val = values[task3BlockId][task3ActionId].value ?? null;

    // リマインド時間（帰宅時間）
    const remindTime =
      values[remindTimeBlockId][remindTimeActionId].selected_time;
    const remindTimeAry = remindTime!.split(":").map((v) => parseInt(v));
    const hour = remindTimeAry[0];
    const minute = remindTimeAry[1];
    const remindTimeUnix = dayjs().startOf("day").hour(hour).minute(minute).unix()

    // 今日のタスクを追加
    const task1: Task = {
      content: task1_val,
      achievement: 0,
      number: 1,
      user_id: user_id,
      created_at: now.toDate(),
    };
    const doc1 = await addDoc(taskCollectionRef, task1);
    const task1_id = doc1.id;
    if (task1?.content != null) {
      await client.chat.scheduleMessage({
        channel: user_id,
        post_at: remindTimeUnix,
        blocks: TaskReportBlock({
          task: task1,
          block_id: `${taskReportBlockId}_${task1_id}`,
          action_id: `${taskReportActionId}_${task1_id}`,
        }),
      });
    }

    const task2: Task = {
      content: task2_val,
      achievement: 0,
      number: 2,
      user_id: user_id,
      created_at: now.toDate(),
    };
    const doc2 = await addDoc(taskCollectionRef, task2);
    const task2_id = doc2.id;
    if (task2?.content != null) {
      await client.chat.scheduleMessage({
        channel: user_id,
        post_at: remindTimeUnix,
        blocks: TaskReportBlock({
          task: task2,
          block_id: `${taskReportBlockId}_${task2_id}`,
          action_id: `${taskReportActionId}_${task2_id}`,
        }),
      });
    }

    const task3: Task = {
      content: task3_val,
      achievement: 0,
      number: 3,
      user_id: user_id,
      created_at: now.toDate(),
    };
    const doc3 = await addDoc(taskCollectionRef, task3);
    const task3_id = doc3.id;
    if (task3?.content != null) {
      await client.chat.scheduleMessage({
        channel: user_id,
        post_at: remindTimeUnix,
        blocks: TaskReportBlock({
          task: task3,
          block_id: `${taskReportBlockId}_${task3_id}`,
          action_id: `${taskReportActionId}_${task3_id}`,
        }),
      });
    }

    await client.chat.postMessage({
      channel: user_id,
      text: `ありがとうございます！${remindTime}になったらタスクの状況についてお聞きします！`,
    });
  } catch (error) {
    await client.chat.postMessage({
      channel: user_id,
      text: "すみません、タスクの登録に失敗しました、、😢",
    });
  }
};
