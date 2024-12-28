/* eslint-disable @typescript-eslint/no-unused-vars */
import Cookies from "js-cookie";

enum STORAGE_TYPE {
  Cookies = "cookies",
  LocalStorage = "local-storage",
  SessionStorage = "session-storage",
}

const getItem = ({
  key,
  storage = STORAGE_TYPE.Cookies,
}: {
  key: string;
  storage?: STORAGE_TYPE;
}) => {
  switch (storage) {
    case STORAGE_TYPE.Cookies:
      return Cookies.get(key);
    case STORAGE_TYPE.LocalStorage:
      try {
        const localItem = localStorage.getItem(key);
        try {
          return localItem ? JSON.parse(localItem) : null; //TODO: refactor so that parse is not called if not needed
        } catch (e) {}
        return localItem;
      } catch (e) {}
      return null;
    case STORAGE_TYPE.SessionStorage:
      try {
        const sessionItem = sessionStorage.getItem(key);
        try {
          return sessionItem ? JSON.parse(sessionItem) : null;
        } catch (e) {}
        return sessionItem;
      } catch (e) {}
      return null;
    default:
      break;
  }
};

const setItem = ({
  key,
  value,
  storage = STORAGE_TYPE.Cookies,
  expiresInDays = null,
}: {
  key: string;
  value: string;
  storage?: STORAGE_TYPE;
  expiresInDays?: number | null;
}) => {
  const secure = process.env.REACT_APP_ENV !== "development";
  switch (storage) {
    case STORAGE_TYPE.Cookies:
      if (expiresInDays)
        return Cookies.set(key, value, {
          expires: expiresInDays,
          secure: secure,
          sameSite: "Lax",
        });
      return Cookies.set(key, value, { secure: secure, sameSite: "Lax" });
    case STORAGE_TYPE.LocalStorage:
      try {
        if (typeof value === "object")
          return localStorage.setItem(key, JSON.stringify(value));
        return localStorage.setItem(key, value);
      } catch (e) {}
      return null;
    case STORAGE_TYPE.SessionStorage:
      try {
        if (typeof value === "object")
          return sessionStorage.setItem(key, JSON.stringify(value));
        return sessionStorage.setItem(key, value);
      } catch (e) {}
      return null;
    default:
      break;
  }
};

const removeItem = ({
  key,
  storage = STORAGE_TYPE.Cookies,
}: {
  key: string;
  storage?: STORAGE_TYPE;
}) => {
  switch (storage) {
    case STORAGE_TYPE.Cookies:
      return Cookies.remove(key);
    case STORAGE_TYPE.LocalStorage:
      try {
        return localStorage.removeItem(key);
      } catch (e) {
        return null;
      }
    case STORAGE_TYPE.SessionStorage:
      try {
        return sessionStorage.removeItem(key);
      } catch (e) {}
      return null;
    default:
      break;
  }
};

const storage = {
  STORAGE_TYPE,
  getItem,
  setItem,
  removeItem,
};
export default storage;
