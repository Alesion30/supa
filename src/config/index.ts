//////////////////////////////////////////////////////////////////////////////////
// 環境変数
//////////////////////////////////////////////////////////////////////////////////

/** ポート番号 */
export const PORT = parseInt(process.env.PORT || "3000");

/** BOTトークン */
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";

/** シークレットトークン */
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || "";
