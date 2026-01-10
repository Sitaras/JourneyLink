import { t } from "@lingui/core/macro";
import { ErrorCodes } from "@journey-link/shared";

export const getErrorMapping = (): Record<string, string> => ({
  // Common
  [ErrorCodes.SOMETHING_WENT_WRONG]: t`Something went wrong`,
  [ErrorCodes.UNAUTHORIZED]: t`Unauthorized`,
  [ErrorCodes.NOT_FOUND]: t`Not found`,
  [ErrorCodes.BAD_REQUEST]: t`Bad request`,
  [ErrorCodes.FORBIDDEN]: t`Forbidden`,

  // Auth
  [ErrorCodes.PASSWORDS_DO_NOT_MATCH]: t`Passwords do not match`,
  [ErrorCodes.USER_ALREADY_EXISTS]: t`User already exists`,
  [ErrorCodes.EMAIL_ALREADY_IN_USE]: t`Email already in use`,
  [ErrorCodes.PHONE_NUMBER_ALREADY_IN_USE]: t`Phone number already in use`,
  [ErrorCodes.INVALID_CREDENTIALS]: t`Invalid email or password`,

  // Booking
  [ErrorCodes.INVALID_RIDE_ID]: t`Invalid Ride ID`,
  [ErrorCodes.RIDE_NOT_FOUND]: t`Ride not found`,
  [ErrorCodes.RIDE_NOT_AVAILABLE]: t`Ride is not available for booking`,
  [ErrorCodes.DRIVER_CANNOT_BOOK_OWN_RIDE]: t`You cannot book your own ride`,
  [ErrorCodes.USER_ALREADY_IN_RIDE]: t`You already have a booking for this ride`,
  [ErrorCodes.BOOKING_NOT_FOUND]: t`Booking not found`,
  [ErrorCodes.UNAUTHORIZED_ACCEPT_BOOKING]: t`Unauthorized to accept this booking`,
  [ErrorCodes.BOOKING_NOT_PENDING_ACCEPT]: t`Booking is not pending`,
  [ErrorCodes.RIDE_FOR_BOOKING_NOT_FOUND]: t`Ride for this booking not found`,
  [ErrorCodes.RIDE_NOT_BOOKABLE]: t`Ride is not bookable`,
  [ErrorCodes.UNAUTHORIZED_DECLINE_BOOKING]: t`Unauthorized to decline this booking`,
  [ErrorCodes.BOOKING_NOT_PENDING_DECLINE]: t`Booking is not pending`,
  [ErrorCodes.UNAUTHORIZED_VIEW_BOOKINGS]: t`Not authorized to view bookings`,
  [ErrorCodes.UNAUTHORIZED_CANCEL_BOOKING]: t`Unauthorized to cancel this booking`,
  [ErrorCodes.BOOKING_CANNOT_CANCEL]: t`Booking cannot be cancelled in its current status`,

  // Ride
  [ErrorCodes.USER_NOT_FOUND]: t`User not found`,
  [ErrorCodes.INCOMPLETE_PROFILE]: t`Please complete your profile first (Name, Email, Phone, Bio, Socials)`,
  [ErrorCodes.RIDE_ALREADY_CANCELLED]: t`Ride is already cancelled`,
  [ErrorCodes.CANNOT_CANCEL_COMPLETED_RIDE]: t`Cannot cancel a completed ride`,
  [ErrorCodes.UNAUTHORIZED_DELETE_RIDE]: t`Not authorized to delete this ride`,
  [ErrorCodes.UNAUTHORIZED_UPDATE_RIDE]: t`Not authorized to update this ride`,
  [ErrorCodes.CANNOT_EDIT_COMPLETED_RIDE]: t`Cannot edit a completed ride`,
  [ErrorCodes.CANNOT_EDIT_CANCELLED_RIDE]: t`Cannot edit a cancelled ride`,
  [ErrorCodes.DEPARTURE_TIME_MUST_BE_FUTURE]: t`Departure time must be in the future`,
  [ErrorCodes.CANNOT_REDUCE_SEATS]: t`Cannot reduce seats below confirmed bookings`,

  // User
  [ErrorCodes.PROFILE_NOT_FOUND]: t`Profile not found`,
  [ErrorCodes.UNAUTHORIZED_VIEW_PROFILE]: t`You can only view profiles of users you have a confirmed ride with`,
});
