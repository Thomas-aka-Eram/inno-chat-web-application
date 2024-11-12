import {
  createContext,
  useState,
  Dispatch,
  useEffect,
  SetStateAction,
  ReactNode,
} from "react";

export type User = {
  _id: string;
  name: string;
  email: string;
  token?: string;
};

export interface UserContextInterface {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (userData: User) => void;
  logout: () => void;
}

const defaultState = {
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
} as UserContextInterface;

export const UserContext = createContext(defaultState);

type UserProviderProps = {
  children: ReactNode;
};

export default function AuthContextProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
