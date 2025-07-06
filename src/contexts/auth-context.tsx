
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, UserRole, UserVerificationStatus } from '@/types';
import { dummyUsers as initialUsers } from '@/lib/dummy-data';
import { v4 as uuidv4 } from 'uuid';

type LoginCredentials = {
  email: string;
  password?: string;
};

type SignupData = Omit<User, 'id' | 'verificationStatus' | 'avatar' | 'password' | 'wishlist'> & {
    password?: string;
};

interface AuthContextType {
  user: User | null | undefined; // undefined means loading, null means not logged in
  loading: boolean;
  users: User[];
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (userData: SignupData) => Promise<User>;
  logout: () => void;
  deleteUser: (userId: string) => void;
  submitForVerification: (userId: string, documentUrl: string) => void;
  updateVerificationStatus: (userId: string, status: UserVerificationStatus) => void;
  toggleWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
  switchToHostRole: (userId: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: true,
  users: [],
  login: async () => { throw new Error('login not implemented'); },
  signup: async () => { throw new Error('signup not implemented'); },
  logout: () => {},
  deleteUser: () => {},
  submitForVerification: () => {},
  updateVerificationStatus: () => {},
  toggleWishlist: () => {},
  isInWishlist: () => false,
  switchToHostRole: () => {},
});

const USERS_STORAGE_KEY = 'allUsers';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Load all users from storage, or initialize
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(initialUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      setUsers(initialUsers);
    }
    
    // Load current user from storage
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to parse current user from localStorage", error);
      setUser(null);
    } finally {
        setLoading(false);
    }
  }, []);

  const persistUsers = (updatedUsers: User[], newCurrentUser?: User | null) => {
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    
    if (newCurrentUser !== undefined) {
      setUser(newCurrentUser);
      if (newCurrentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newCurrentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } else if (user) {
        const updatedCurrentUser = updatedUsers.find(u => u.id === user.id);
        if (updatedCurrentUser) {
            setUser(updatedCurrentUser);
            localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedCurrentUser));
        }
    }
  };

  const login = useCallback(async ({ email, password }: LoginCredentials): Promise<User> => {
    const originalAdmin = initialUsers.find(u => u.role === 'super-admin');

    if (originalAdmin && email.toLowerCase() === originalAdmin.email.toLowerCase()) {
      if (originalAdmin.password === password) {
        const allUsers: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const adminUserInStorage = allUsers.find(u => u.role === 'super-admin');
        const adminUser = adminUserInStorage || originalAdmin;
        
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(adminUser));
        setUser(adminUser);
        return adminUser;
      } else {
        throw new Error("Incorrect password for admin.");
      }
    }

    const allUsers: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const userToLogin = allUsers.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase());

    if (!userToLogin) {
      throw new Error("No user found with that email address.");
    }
    
    if (userToLogin.password !== password) {
      throw new Error("Incorrect password.");
    }

    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToLogin));
    setUser(userToLogin);
    return userToLogin;
  }, []);

  const signup = useCallback(async (userData: SignupData): Promise<User> => {
    const allUsers: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const emailExists = allUsers.some(u => u.email && u.email.toLowerCase() === userData.email.toLowerCase());

    if (emailExists) {
        throw new Error("An account with this email already exists.");
    }

    const newUser: User = {
        ...userData,
        id: uuidv4(),
        avatar: `https://placehold.co/100x100.png?text=${userData.name.charAt(0)}`,
        verificationStatus: 'unverified',
        wishlist: [],
    };

    const updatedUsers = [...allUsers, newUser];
    persistUsers(updatedUsers, newUser);

    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setUser(null);
  }, []);
  
  const deleteUser = useCallback((userId: string) => {
    const currentUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const userToDelete = currentUsers.find((u: User) => u.id === userId);
    
    if (userToDelete && userToDelete.role === 'super-admin') {
      console.error("Cannot delete super-admin.");
      return;
    }

    const updatedUsers = currentUsers.filter((u: User) => u.id !== userId);
    persistUsers(updatedUsers);
  }, []);

  const submitForVerification = useCallback((userId: string, documentUrl: string) => {
    const currentUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const updatedUsers = currentUsers.map((u: User) => {
        if (u.id === userId) {
            return { ...u, verificationStatus: 'pending' as UserVerificationStatus, identityDocumentUrl: documentUrl };
        }
        return u;
    });
    persistUsers(updatedUsers);
  }, []);

  const updateVerificationStatus = useCallback((userId: string, status: UserVerificationStatus) => {
    const currentUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const updatedUsers = currentUsers.map((u: User) => {
        if (u.id === userId) {
            const updatedUser = { ...u, verificationStatus: status };
            if (status === 'rejected') {
              delete updatedUser.identityDocumentUrl;
            }
            return updatedUser;
        }
        return u;
    });
    persistUsers(updatedUsers);
  }, []);
  
  const isInWishlist = (propertyId: string): boolean => {
    return !!user?.wishlist?.includes(propertyId);
  };

  const toggleWishlist = (propertyId: string) => {
    if (!user) return;

    const currentUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    let updatedUser: User | null = null;

    const updatedUsers = currentUsers.map((u: User) => {
        if (u.id === user.id) {
            const currentWishlist = u.wishlist || [];
            const newWishlist = currentWishlist.includes(propertyId)
                ? currentWishlist.filter(id => id !== propertyId)
                : [...currentWishlist, propertyId];
            updatedUser = { ...u, wishlist: newWishlist };
            return updatedUser;
        }
        return u;
    });

    if (updatedUser) {
        persistUsers(updatedUsers, updatedUser);
    }
  };

  const switchToHostRole = useCallback((userId: string) => {
    const currentUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    let updatedUser: User | null = null;
    const updatedUsers = currentUsers.map((u: User) => {
        if (u.id === userId) {
            updatedUser = { ...u, role: 'host' as UserRole };
            return updatedUser;
        }
        return u;
    });

    if (updatedUser) {
        persistUsers(updatedUsers, updatedUser);
    }
  }, [user]);

  const value = { user, loading, users, login, signup, logout, deleteUser, submitForVerification, updateVerificationStatus, toggleWishlist, isInWishlist, switchToHostRole };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
