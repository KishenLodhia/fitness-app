import React from "react";
import { useStorageState } from "./useStorageState";
import axios from "axios";
import { useToast } from "react-native-toast-notifications"; // Import useToast

type User = {
  token: string | null;
  id: number | null;
};

const AuthContext = React.createContext<{
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  user?: User | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  user: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const toast = useToast(); // Get the toast instance
  const [[isLoading, user], setSession] = useStorageState("session");
  const setUser = (user: User | null) => {
    if (user === null) {
      setSession(null);
    } else {
      setSession(JSON.stringify(user));
    }
  };

  const getUser = (): User | null => {
    if (user === null) {
      return null;
    } else {
      return JSON.parse(user) as User;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username: string, password: string) => {
          try {
            const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/login`, {
              email: username,
              password: password,
            });
            if (response.status === 200) {
              const newUser: User = {
                token: response.data.token,
                id: response.data.user_id,
              };
              setUser(newUser);
              toast.show("Login successful", { type: "success" }); // Show success toast
            } else {
              throw new Error("An error occured");
            }
          } catch (error) {
            console.log(error);
            toast.show("Login failed. Please try again.", { type: "danger" }); // Show error toast
          }
        },
        signOut: () => {
          setSession(null);
          toast.show("Logged out successfully", { type: "success" }); // Show logout toast
        },
        user: getUser(),
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
