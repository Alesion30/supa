import {
  collection,
  Converter,
  doc,
  DocumentData,
  firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "../plugins/firebase";
import { User } from "../types/user";

/** コレクション名 */
export const USER_COLLECTION_NAME: string = "users";

/** コンバーター層 */
const userConverter: Converter<User> = {
  toFirestore(data: User): DocumentData {
    return { ...data };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options)!;
    const user: User = {
      user_id: data.user_id,
      user_name: data.user_name,
      isSubscribed: data.isSubscribed,
      created_at: data.created_at,
    };
    return user;
  },
};

/**
 * ユーザー コレクションReference
 *
 * - コレクション名: `users`
 * - ドキュメント型: `User`
 */
export const userCollectionRef = collection(
  firestore,
  USER_COLLECTION_NAME
).withConverter(userConverter);

/**
 * ユーザー ドキュメントReference
 *
 * - コレクション名: `users`
 * - ドキュメント型: `User`
 */
export const userDocumentRef = (docId: string) =>
  doc(firestore, USER_COLLECTION_NAME, docId);
