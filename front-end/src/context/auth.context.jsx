import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    name: "",
    email: "",
    phone: "",
  },
  setAuth: () => {},
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      name: "",
      email: "",
      phone: "",
    },
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};
