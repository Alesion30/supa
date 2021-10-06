import { Block, KnownBlock } from "../types/bolt";
// import { Task } from "../types/task";

type TaskListBlocksProps = {
  user: string;
  //   tasks: Task[];
};

export const TaskListBlocks = (
  props: TaskListBlocksProps
): (Block | KnownBlock)[] => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${props.user}>さん！今日もお疲れ様でした！タスクの進捗はいかがでしたか？`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "[タスク1] 論文を読む",
      },
    },
    TaskRadioButton({ action_id: "task1" }),
    {
      type: "divider",
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "[タスク2] 昼ごはんを食べる",
      },
    },
    TaskRadioButton({ action_id: "task2" }),
    {
      type: "divider",
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "[タスク3] 筋トレをする",
      },
    },
    TaskRadioButton({ action_id: "task3" }),
    {
      type: "divider",
    },
  ];
};

type TaskRadioButtonProps = {
  action_id: string;
};

const TaskRadioButton = (props: TaskRadioButtonProps): KnownBlock => {
  return {
    type: "actions",
    elements: [
      {
        type: "radio_buttons",
        action_id: props.action_id,
        initial_option: {
          value: "0",
          text: {
            type: "plain_text",
            text: "未選択",
          },
        },
        options: [
          {
            value: "3",
            text: {
              type: "plain_text",
              text: "完璧😏",
            },
          },
          {
            value: "2",
            text: {
              type: "plain_text",
              text: "半分くらいはできた😄",
            },
          },
          {
            value: "1",
            text: {
              type: "plain_text",
              text: "ほとんどできなかった😢",
            },
          },
          {
            value: "0",
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
