export type User = {
  user_id: string; // ユーザーID
  user_name: string; // ユーザー名
  is_subscribed: boolean; // 定期購読中かどうか
  dm_channel: string; // DM チャンネルID
  created_at: Date; // 作成日
};
