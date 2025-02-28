import storage from "./storage";

const TOKEN_KEY = "access_token";
const REFRESHTOKEN_KEY = "refresh_token";
const USER_ID = "user_id";

const getAccessToken = () => {
  return storage.getItem({ key: TOKEN_KEY });
};

const setAccessToken = ({ accessToken }: { accessToken: string }) => {
  return storage.setItem({
    key: TOKEN_KEY,
    value: accessToken,
    expiresInDays: 365,
  });
};

const removeAccessToken = () => {
  return storage.removeItem({ key: TOKEN_KEY });
};

const getRefreshToken = () => {
  return storage.getItem({ key: REFRESHTOKEN_KEY });
};

const setRefreshToken = ({ refreshToken }: { refreshToken: string }) => {
  return storage.setItem({
    key: REFRESHTOKEN_KEY,
    value: refreshToken,
    expiresInDays: 365,
  });
};

const removeRefreshToken = () => {
  return storage.removeItem({ key: REFRESHTOKEN_KEY });
};

const removeUserId = () => {
  return storage.removeItem({
    key: USER_ID,
    storage: storage.STORAGE_TYPE.LocalStorage,
  });
};

const clearAuthTokens = () => {
  removeAccessToken();
  removeRefreshToken();
  removeUserId();
};

const authStorage = {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  clearAuthTokens,
  keys: { USER_ID, TOKEN_KEY, REFRESHTOKEN_KEY },
};
export default authStorage;
