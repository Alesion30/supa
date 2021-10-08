import {
  collection,
  Converter,
  doc,
  DocumentData,
  firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "../plugins/firebase";
import { Task } from "../types/task";

/** コレクション名 */
export const TASK_COLLECTION_NAME: string = "tasks";

/** コンバーター層 */
const taskConverter: Converter<Task> = {
  toFirestore(data: Task): DocumentData {
    return { ...data };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Task {
    const id = snapshot.id;
    const data = snapshot.data(options)!;
    const task: Task = {
      id,
      content: data.content,
      achievement: data.achievement,
      number: data.number,
      user_id: data.user_id,
      created_at: data.created_at,
    };
    return task;
  },
};

/**
 * タスク コレクションReference
 *
 * - コレクション名: `tasks`
 * - ドキュメント型: `Task`
 */
export const taskCollectionRef = collection(
  firestore,
  TASK_COLLECTION_NAME
).withConverter(taskConverter);

/**
 * タスク ドキュメントReference
 *
 * - コレクション名: `tasks`
 * - ドキュメント型: `Task`
 */
export const taskDocumentRef = (docId: string) =>
  doc(firestore, TASK_COLLECTION_NAME, docId);
