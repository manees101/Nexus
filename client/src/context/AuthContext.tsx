import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import useLocalStorage from "../hooks/useLocalStorage";
type AuthContext = {
  signup: UseMutationResult<AxiosResponse, unknown, User>;
  login: UseMutationResult<{ token: string; user: User }, unknown, string>;
  user?: User;
  streamChat?: StreamChat;
  logout: UseMutationResult<AxiosResponse, unknown, void>;
};
const Context = createContext<AuthContext | null>(null);
export const useAuth = () => {
  return useContext(Context) as AuthContext;
};
export const useLoggedInAuth = () => {
  return useContext(Context) as AuthContext &
    Required<Pick<AuthContext, "user">>;
};
type AuthProviderProps = {
  children: ReactNode;
};
type User = {
  id: string;
  name: string;
  image?: string;
};
export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [token, setToken] = useLocalStorage<string>("token");
  const [user, setUser] = useLocalStorage<User>("user");
  const [streamChat, setStreamChat] = useState<StreamChat>();
  const signup = useMutation({
    mutationFn: (user: User) => {
      return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user);
    },
    onSuccess: () => {
      navigate("/login");
    },
  });
  const login = useMutation({
    mutationFn: (id: string) => {
      return axios
        .post(`${import.meta.env.VITE_SERVER_URL}/login`, { id })
        .then((res) => res.data as { token: string; user: User });
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
    },
  });
  const logout = useMutation({
    mutationFn: () => {
      return axios.post(`${import.meta.env.VITE_SERVER_URL}/logout`, { token });
    },
    onSuccess: () => {
      setUser(undefined);
      setToken(undefined);
      setStreamChat(undefined);
    },
  });
  useEffect(() => {
    if (!token || !user) return;
    const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY);
    //if user already logged in return don't reconnect them
    if (chat.tokenManager.token === token && chat.userID === user.id) return;

    let isInterrupted = false;
    const connectPromise = chat
      .connectUser({ id: user.id, name: user.name, image: user.image }, token)
      .then(() => {
        if (isInterrupted) return;

        setStreamChat(chat);
      });

    return () => {
      isInterrupted = true;
      setStreamChat(undefined);
      connectPromise.then(() => {
        chat.disconnectUser();
      });
    };
  }, [token, user]);
  return (
    <Context.Provider value={{ signup, login, user, streamChat, logout }}>
      {children}
    </Context.Provider>
  );
}
