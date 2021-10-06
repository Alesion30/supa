import { KnownBlock } from "../types/bolt.d";

type PlainTextInputProps = {
  block_id: string;
  label: string;
  action_id: string;
  placeholder: string;
  multiline: boolean;
  optional?: boolean;
};

/**
 * テキストタイプの入力欄
 */
export const PlainTextInput = (props: PlainTextInputProps): KnownBlock => {
  return {
    type: "input",
    block_id: props.block_id,
    label: {
      type: "plain_text",
      text: props.label,
    },
    element: {
      type: "plain_text_input",
      action_id: props.action_id,
      multiline: props.multiline,
      placeholder: {
        type: "plain_text",
        text: props.placeholder,
      },
    },
    optional: props.optional,
  };
};

type TimePickerInputProps = {
  block_id: string;
  label: string;
  action_id: string;
  initial_time?: string;
};

/**
 * タイムピッカー
 */
export const TimePickerInput = (props: TimePickerInputProps): KnownBlock => {
  return {
    type: "section",
    block_id: props.block_id,
    text: {
      type: "mrkdwn",
      text: props.label,
    },
    accessory: {
      type: "timepicker",
      action_id: props.action_id,
      initial_time: props.initial_time,
    },
  };
};
