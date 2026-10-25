import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const readCustomer = () => {
  try {
    return JSON.parse(localStorage.getItem("customer")) || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(readCustomer);

  const login = (token, data) => {
    localStorage.setItem("customerToken", token);
    localStorage.setItem("customer", JSON.stringify(data));
    setCustomer(data);
  };

  const updateCustomer = (data) => {
    localStorage.setItem("customer", JSON.stringify(data));
    setCustomer(data);
  };

  const logout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, login, logout, updateCustomer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
