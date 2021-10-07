import {
  Middleware,
  SlackAction,
  SlackActionMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackViewAction,
  SlackViewMiddlewareArgs,
} from "@slack/bolt";

export type { Block, KnownBlock, InputBlock, DividerBlock } from "@slack/bolt";

/** action listener関数 */
export type AppActionFunction = Middleware<
  SlackActionMiddlewareArgs<SlackAction>
>;

/** message listener関数 */
export type AppMessageFunction = Middleware<
  SlackEventMiddlewareArgs<"message">
>;

/** view listener関数 */
export type AppViewFunction = Middleware<
  SlackViewMiddlewareArgs<SlackViewAction>
>;
