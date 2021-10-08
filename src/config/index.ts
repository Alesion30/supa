//////////////////////////////////////////////////////////////////////////////////
// 環境変数
//////////////////////////////////////////////////////////////////////////////////
export const PORT = parseInt(process.env.PORT || "3000");

//////////////////////////////////////
// Slack
//////////////////////////////////////
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || "";

//////////////////////////////////////
// supabase
//////////////////////////////////////
export const SUPABASE_URL = process.env.SUPABASE_URL || "";
export const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY || "";

//////////////////////////////////////
// firebase
//////////////////////////////////////
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "";
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || "";
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";
export const FIREBASE_STORAGE_BAKET = process.env.FIREBASE_STORAGE_BAKET || "";
export const FIREBASE_MESSAGE_SENDER_ID =
  process.env.FIREBASE_MESSAGE_SENDER_ID || "";
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || "";
export const FIREBASE_MEASUREMENT_ID =
  process.env.FIREBASE_MEASUREMENT_ID || "";
