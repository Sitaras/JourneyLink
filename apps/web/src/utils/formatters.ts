export const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
});

export const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeStyle: "short",
});

export const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
