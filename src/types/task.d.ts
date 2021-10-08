export type Task = {
  id: number; // タスク番号
  content: string | null; // タスク内容
  achievement: number; // タスクの達成度
  number: 1 | 2 | 3; // タスク番号
  user_id: string; // ユーザーID
  created_at: number | null; // 作成日
  created_at_unix: number | null; // 作成日（unix秒）
};
