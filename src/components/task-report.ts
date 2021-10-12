import { Block, KnownBlock } from "../types/bolt";
import { Divider } from "./divider";
import { Task } from "../types/task";

type TaskReportBlockProps = {
  task: Task;
  block_id: string;
  action_id: string;
};

export const TaskReportBlock = (
  props: TaskReportBlockProps
): (Block | KnownBlock)[] => {
  const blockList: (Block | KnownBlock)[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: props.task.content ?? "",
      },
    },
    TaskRadioButton({
      task_id: props.task.id!,
      block_id: props.block_id,
      action_id: props.action_id,
    }),
    Divider,
  ];
  return blockList;
};

type TaskRadioButtonProps = {
  task_id: string;
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
