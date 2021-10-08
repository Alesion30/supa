import { Block, KnownBlock } from "../types/bolt";
import { Divider } from "./divider";
import { Task } from "../types/task";
import {
  task1ReportActionId,
  task1ReportBlockId,
  task2ReportActionId,
  task2ReportBlockId,
  task3ReportActionId,
  task3ReportBlockId,
} from "../functions/report-task";

type TaskReportBlocksProps = {
  user: string;
  task1: Task | null; // タスク1
  task2: Task | null; // タスク2
  task3: Task | null; // タスク3
};

/** タスク完了報告用メッセージ */
export const TaskReportBlocks = (
  props: TaskReportBlocksProps
): (Block | KnownBlock)[] => {
  const blockList: (Block | KnownBlock)[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${props.user}>さん！今日もお疲れ様でした！タスクの進捗はいかがでしたか？`,
      },
    },
    Divider,
  ];

  if (props.task1?.content != null) {
    blockList.push({
      type: "header",
      text: {
        type: "plain_text",
        text: `[タスク1] ${props.task1.content}`,
      },
    });
    blockList.push(
      TaskRadioButton({
        task_id: props.task1.id,
        block_id: task1ReportBlockId,
        action_id: task1ReportActionId,
      })
    );
    blockList.push(Divider);
  }

  if (props.task2?.content != null) {
    blockList.push({
      type: "header",
      text: {
        type: "plain_text",
        text: `[タスク2] ${props.task2.content}`,
      },
    });
    blockList.push(
      TaskRadioButton({
        task_id: props.task2.id,
        block_id: task2ReportBlockId,
        action_id: task2ReportActionId,
      })
    );
    blockList.push(Divider);
  }

  if (props.task3?.content != null) {
    blockList.push({
      type: "header",
      text: {
        type: "plain_text",
        text: `[タスク3] ${props.task3.content}`,
      },
    });
    blockList.push(
      TaskRadioButton({
        task_id: props.task3.id,
        block_id: task3ReportBlockId,
        action_id: task3ReportActionId,
      })
    );
    blockList.push(Divider);
  }

  return blockList;
};

type TaskRadioButtonProps = {
  task_id: number;
  block_id: string;
  action_id: string;
};

/**
 * ラジオボタン
 *
 * - 完璧
 * - 半分くらいはできた
 * - ほとんどできなかった
 * - 未選択
 */
const TaskRadioButton = (props: TaskRadioButtonProps): KnownBlock => {
  return {
    type: "actions",
    block_id: props.block_id,
    elements: [
      {
        type: "radio_buttons",
        action_id: props.action_id,
        initial_option: {
          value: `${props.task_id}:0`,
          text: {
            type: "plain_text",
            text: "未選択",
          },
        },
        options: [
          {
            value: `${props.task_id}:3`,
            text: {
              type: "plain_text",
              text: "完璧😏",
            },
          },
          {
            value: `${props.task_id}:2`,
            text: {
              type: "plain_text",
              text: "半分くらいはできた😄",
            },
          },
          {
            value: `${props.task_id}:1`,
            text: {
              type: "plain_text",
              text: "ほとんどできなかった😢",
            },
          },
          {
            value: `${props.task_id}:0`,
            text: {
              type: "plain_text",
              text: "未選択",
            },
          },
        ],
      },
    ],
  };
};
