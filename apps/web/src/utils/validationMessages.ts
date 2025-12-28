import { msg } from "@lingui/core/macro";
import { i18n } from "@lingui/core";
import { MessageDescriptor } from "@lingui/core";

export const validationMessages: Record<string, MessageDescriptor> = {
  INVALID_EMAIL_ADDRESS: msg`Invalid email address`,
  EMAIL_REQUIRED: msg`Email is required`,
  PASSWORD_REQUIRED: msg`Password is required`,
  REQUIRED: msg`required`,
  PASSWORD_MIN_LENGTH: msg`Min length 8 characters`,
  PASSWORD_MAX_LENGTH: msg`Max length 20 characters`,
  PASSWORD_UPPERCASE_REQUIRED: msg`Uppercase letter required`,
  PASSWORD_LOWERCASE_REQUIRED: msg`Lowercase letter required`,
  PASSWORD_NUMBER_REQUIRED: msg`Number required`,
  PASSWORD_SPECIAL_CHAR_REQUIRED: msg`Special character required`,
  PASSWORDS_DO_NOT_MATCH: msg`Passwords do not match`,
  INVALID_PHONE_FORMAT: msg`Invalid format`,
};

export const getValidationMessage = (key: string): string => {
  const messageDescriptor = validationMessages[key];
  if (messageDescriptor) {
    return i18n._(messageDescriptor);
  }
  return key;
};
