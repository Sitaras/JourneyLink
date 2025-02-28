import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { IUser } from "@/types/user.types";
import authStorage from "@/storage/authStorage";
import { decodeToken } from "@/utils/userUtils";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (user: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = authStorage.getAccessToken();
  const { userId } = token ? decodeToken(token) : {};

  useEffect(() => {
    if (!userId) {
      return;
    }

    setIsLoading(true);

    // getAccountInfo(userId)
    //   .then((accountRes) => {
    //     const { data: user } = accountRes || {};
    //     if (user) {
    //       setUser(user);

    //       return user;
    //     }
    //   })
    //   .catch()
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  }, [userId]);

  const login = useCallback(() => {}, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
