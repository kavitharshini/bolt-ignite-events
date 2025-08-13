import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  company: string;
  role: string;
  joinDate: string;
  isAdmin: boolean;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  updateUser: (updates: Partial<User>) => void;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const defaultUser: User = {
  id: "1",
  name: "Arjun Sharma",
  email: "arjun.sharma@email.com",
  phone: "+91 98765 43210",
  bio: "Event management professional with 5+ years of experience in organizing corporate events and conferences.",
  location: "Mumbai, Maharashtra",
  company: "EventMaster Solutions",
  role: "Senior Event Manager",
  joinDate: new Date("2023-01-15").toLocaleDateString(),
  isAdmin: true,
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, updateUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};