import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "../config";
import { Task } from "../types/task";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

////////////////////////////////////////////////////////////////
// テーブル
////////////////////////////////////////////////////////////////

/** タスクテーブル */
export const TASK_TABLE = supabase.from<Task>("tasks");
