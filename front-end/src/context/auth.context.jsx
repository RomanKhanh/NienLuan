import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    name: "",
    email: "",
    phone: "",
  },
  setAuth: () => {},
  loading: true,
  setLoading: () => {},
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      name: "",
      email: "",
      phone: "",
      avatar: "",
    },
  });

  const [loading, setLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, setLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};
