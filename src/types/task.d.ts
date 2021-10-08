export type Task = {
  id?: string; // タスク番号
  content: string | null; // タスク内容
  achievement: number; // タスクの達成度
  number: 1 | 2 | 3; // タスク番号
  user_id: string; // ユーザーID
  created_at: Date; // 作成日
};
