import {
  format as formatDateFns,
  addDays as addDaysFns,
  subYears,
  isPast as isPastFns,
  isFuture as isFutureFns,
  isBefore as isBeforeFns,
  isAfter as isAfterFns,
  isEqual as isEqualFns,
  differenceInDays,
  parseISO,
  endOfMonth as endOfMonthFns,
  endOfDay as endOfDayFns,
  startOfDay as startOfDayFns,
  isValid,
  parse,
  fromUnixTime,
  toDate,
  min,
  getYear,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInMilliseconds,
} from "date-fns";
import { el } from "date-fns/locale/el";
import { DateFormats } from "./dateFormats";

export const isValidDate = (date: unknown) => {
  return isValid(date);
};

export const parseDate = (
  date: string | Date | number,
  format?: string,
  returnNowIfNull = false
) => {
  if (date && typeof date === "object") return date;
  const _parsedDate =
    format && typeof date === "string"
      ? parse(date, format, new Date())
      : typeof date === "number"
      ? fromUnixTime(date)
      : parseISO(date);

  if (isValid(_parsedDate) && getYear(_parsedDate) > 1) {
    return _parsedDate;
  }

  return returnNowIfNull ? new Date() : null;
};

export const formatDate = (
  date: string | Date,
  format = DateFormats.DATE_TIME_SLASH_FORMAT,
  language?: string
) => {
  const parsedDate = parseDate(date);

  if (!parsedDate) return "";
  const dateString = formatDateFns(parsedDate, format, {
    locale: language === "el" ? el : undefined,
  });
  return dateString;
};

export const formatToUTC = (date: string | Date) => {
  const parsedDate = parseDate(date);

  if (!parsedDate) return "";
  const dateString = toDate(parsedDate).toISOString();
  return dateString;
};

export const getDayName = (date: string | Date, { language = "en" } = {}) => {
  return formatDate(date, DateFormats.DAY_NAME, language);
};

export const addDays = (date: string | Date, days: number) => {
  const parsedDate = parseDate(date);
  if (!parsedDate) return null;

  return addDaysFns(parsedDate, days);
};

export const subtractYears = (date: string | number | Date, years: number) => {
  const parsedDate = parseDate(date);
  if (!parsedDate) return null;
  return subYears(parsedDate, years);
};

export const getDifferenceInDays = (
  dateFrom: string | number | Date,
  dateUntil: string | number | Date,
  options: { includeLastDay: boolean; useStartOfDay: boolean } = {
    includeLastDay: false,
    useStartOfDay: true,
  }
) => {
  const { includeLastDay = false, useStartOfDay = true } = options;
  const parsedDateFrom = parseDate(dateFrom);
  const parsedDateUntil = parseDate(dateUntil);
  if (!parsedDateFrom || !parsedDateUntil) return 0;

  const _from = useStartOfDay ? startOfDay(parsedDateFrom) : parsedDateFrom;

  const _until = addDays(
    (useStartOfDay ? startOfDay(parsedDateUntil) : parsedDateUntil) as Date,
    includeLastDay ? 1 : 0
  );
  return _until && _from ? differenceInDays(_until, _from) : 0;
};

const precisionFunctions = {
  day: differenceInDays,
  week: differenceInWeeks,
  month: differenceInMonths,
  year: differenceInYears,
  hour: differenceInHours,
  minute: differenceInMinutes,
  second: differenceInSeconds,
  millisecond: differenceInMilliseconds,
};

export const getDateDifference = (
  date: string | Date,
  dateToCompare: string | Date,
  precision: keyof typeof precisionFunctions
): number | undefined => {
  if (!date || !dateToCompare) return;

  const dateParsed = typeof date === "string" ? parseISO(date) : date;
  const startDateParsed =
    typeof dateToCompare === "string" ? parseISO(dateToCompare) : dateToCompare;

  // @ts-ignore
  const differenceFunction = precisionFunctions[precision];
  // @ts-ignore
  return Math.abs(differenceFunction(dateParsed, startDateParsed));
};

/**
 * returns end of date, null if parsing fails */
export const endOfDay = (date: string | number | Date) => {
  const parsedDate = parseDate(date);
  if (parsedDate) return endOfDayFns(parsedDate);
  return null;
};

/**
 * returns end of month, null if parsing fails */
export const endOfMonth = (date: string | number | Date) => {
  const parsedDate = parseDate(date);
  if (parsedDate) return endOfMonthFns(parsedDate);
  return null;
};

/**
 * returns start of date, null if parsing fails */
export const startOfDay = (date: string | number | Date) => {
  const parsedDate = parseDate(date);
  if (parsedDate) return startOfDayFns(parsedDate);
  return null;
};

/* date comparison functions */

export const isDateBetween = (
  date: string | number | Date,
  compareFromDate: string | number | Date,
  compareToDate: string | number | Date
) => {
  const parsedDate = parseDate(date);
  const parsedFromDate = parseDate(compareFromDate);
  const parsedToDate = parseDate(compareToDate);

  if (!parsedDate || !parsedFromDate || !parsedToDate) return false;

  const _date = startOfDay(parsedDate);
  // @ts-ignore
  return startOfDay(parsedFromDate) <= _date && _date <= endOfDay(parsedToDate);
};

export const isBetween = (
  date: string | number | Date,
  compareFromDate: string | number | Date,
  compareToDate: string | number | Date
) => {
  const parsedDate = parseDate(date);
  const parsedFromDate = parseDate(compareFromDate);
  const parsedToDate = parseDate(compareToDate);

  if (!parsedDate || !parsedFromDate || !parsedToDate) return false;

  return parsedFromDate <= parsedDate && parsedDate <= parsedToDate;
};

export const isPast = (date: string | number | Date) => {
  const parsedDate = parseDate(date);

  if (!parsedDate) return false;
  return isPastFns(parsedDate);
};

export const isFuture = (date: string | number | Date) => {
  const parsedDate = parseDate(date);

  if (!parsedDate) return false;
  return isFutureFns(parsedDate);
};

export const isAfter = (
  date: string | number | Date,
  dateToCompare: string | number | Date
) => {
  const parsedDate = parseDate(date);
  const parsedDateToCompare = parseDate(dateToCompare);

  if (!parsedDate || !parsedDateToCompare) return false;
  return isAfterFns(parsedDate, parsedDateToCompare);
};

export const isBefore = (
  date: string | number | Date,
  dateToCompare: string | number | Date
) => {
  const parsedDate = parseDate(date);
  const parsedDateToCompare = parseDate(dateToCompare);

  if (!parsedDate || !parsedDateToCompare) return false;
  return isBeforeFns(parsedDate, parsedDateToCompare);
};

export const isEqual = (
  date: string | number | Date,
  dateToCompare: string | number | Date
) => {
  const parsedDate = parseDate(date);
  const parsedDateToCompare = parseDate(dateToCompare);

  if (!parsedDate || !parsedDateToCompare) return false;
  return isEqualFns(parsedDate, parsedDateToCompare);
};

export const minDate = (datesArray: (string | number | Date)[]) =>
  min(datesArray);
