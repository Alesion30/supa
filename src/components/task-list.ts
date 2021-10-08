import { Block, KnownBlock } from "../types/bolt";
import { Divider } from "./divider";
import { Task } from "../types/task";

type TaskListBlocksProps = {
  user: string;
  task1: Task | null; // タスク1
  task2: Task | null; // タスク2
  task3: Task | null; // タスク3
};

/** タスク一覧表示用メッセージ */
export const TaskListBlocks = (
  props: TaskListBlocksProps
): (Block | KnownBlock)[] => {
  const blockList: (Block | KnownBlock)[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "登録されているタスクはこちらです",
      },
    },
    Divider,
  ];

  if (props.task1?.content != null) {
    blockList.push({
      type: "section",
      text: {
        type: "plain_text",
        text: `[タスク1] ${props.task1.content}`,
      },
    });
  }

  if (props.task2?.content != null) {
    blockList.push({
      type: "section",
      text: {
        type: "plain_text",
        text: `[タスク2] ${props.task2.content}`,
      },
    });
  }

  if (props.task3?.content != null) {
    blockList.push({
      type: "section",
      text: {
        type: "plain_text",
        text: `[タスク3] ${props.task3.content}`,
      },
    });
  }

  blockList.push(Divider);

  return blockList;
};
