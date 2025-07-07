
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, UserRole, UserVerificationStatus } from '@/types';
import { dummyUsers as initialUsers } from '@/lib/dummy-data';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  writeBatch,
  query,
  where
} from 'firebase/firestore';


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
  deleteUser: (userId: string) => Promise<void>;
  submitForVerification: (userId: string, documentUrl: string) => Promise<void>;
  updateVerificationStatus: (userId: string, status: UserVerificationStatus) => Promise<void>;
  toggleWishlist: (propertyId: string) => Promise<void>;
  isInWishlist: (propertyId: string) => boolean;
  switchToHostRole: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: true,
  users: [],
  login: async () => { throw new Error('login not implemented'); },
  signup: async () => { throw new Error('signup not implemented'); },
  logout: () => {},
  deleteUser: async () => {},
  submitForVerification: async () => {},
  updateVerificationStatus: async () => {},
  toggleWishlist: async () => {},
  isInWishlist: () => false,
  switchToHostRole: async () => {},
  toggleUserStatus: async () => {},
  updateUser: async () => {},
});

const CURRENT_USER_ID_STORAGE_KEY = 'currentUserId';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize and subscribe to users collection
  useEffect(() => {
    const usersCollection = collection(db, 'users');

    const setupFirestore = async () => {
      const snapshot = await getDocs(usersCollection);
      if (snapshot.empty) {
        console.log('No users found, seeding database...');
        const batch = writeBatch(db);
        initialUsers.forEach(u => {
          const docRef = doc(db, 'users', u.id);
          batch.set(docRef, u);
        });
        await batch.commit();
        console.log('Users collection seeded.');
      }
    };
    
    setupFirestore().then(() => {
      const unsubscribe = onSnapshot(query(collection(db, 'users')), (snapshot) => {
          const updatedUsers: User[] = [];
          snapshot.forEach(doc => {
              updatedUsers.push({ id: doc.id, ...doc.data() } as User);
          });
          setUsers(updatedUsers);

          if (user) {
              const freshUserData = updatedUsers.find(u => u.id === user.id);
              if (freshUserData) {
                setUser(freshUserData);
              } else {
                // User was deleted, log them out
                logout();
              }
          }
      }, (error) => {
          console.error("Error fetching users snapshot: ", error);
      });

      return () => unsubscribe();
    });

  }, [user]);

  // Check for logged-in user on initial load
  useEffect(() => {
    const checkCurrentUser = async () => {
      setLoading(true);
      try {
        const storedUserId = localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);
        if (storedUserId) {
          const userDocRef = doc(db, "users", storedUserId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as User);
          } else {
            setUser(null);
            localStorage.removeItem(CURRENT_USER_ID_STORAGE_KEY);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkCurrentUser();
  }, []);

  const login = useCallback(async ({ email, password }: LoginCredentials): Promise<User> => {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("No user found with that email address.");
    }

    const userDoc = querySnapshot.docs[0];
    const userToLogin = { id: userDoc.id, ...userDoc.data() } as User;
    
    if (userToLogin.isDisabled) {
        throw new Error("This account has been disabled by an administrator.");
    }

    if (userToLogin.password !== password) {
        throw new Error("Incorrect password.");
    }

    localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userToLogin.id);
    setUser(userToLogin);
    return userToLogin;
  }, []);

  const signup = useCallback(async (userData: SignupData): Promise<User> => {
    const q = query(collection(db, "users"), where("email", "==", userData.email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error("An account with this email already exists.");
    }
    
    const newUserId = uuidv4();
    const newUser: User = {
        ...userData,
        id: newUserId,
        avatar: `https://placehold.co/100x100.png?text=${userData.name.charAt(0)}`,
        verificationStatus: 'unverified',
        wishlist: [],
        isDisabled: false,
    };
    
    const userDocRef = doc(db, 'users', newUserId);
    await setDoc(userDocRef, newUser);

    localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, newUser.id);
    setUser(newUser);

    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_ID_STORAGE_KEY);
    setUser(null);
  }, []);
  
  const deleteUser = useCallback(async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === 'super-admin') {
      console.error("Cannot delete super-admin.");
      return;
    }
    await deleteDoc(userDocRef);
  }, []);

  const submitForVerification = useCallback(async (userId: string, documentUrl: string) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { 
      verificationStatus: 'pending', 
      identityDocumentUrl: documentUrl 
    });
  }, []);

  const updateVerificationStatus = useCallback(async (userId: string, status: UserVerificationStatus) => {
    const userDocRef = doc(db, 'users', userId);
    const updateData: Partial<User> = { verificationStatus: status };
    if (status === 'rejected') {
      updateData.identityDocumentUrl = '';
    }
    await updateDoc(userDocRef, updateData);
  }, []);
  
  const isInWishlist = (propertyId: string): boolean => {
    return !!user?.wishlist?.includes(propertyId);
  };

  const toggleWishlist = useCallback(async (propertyId: string) => {
    if (!user) return;
    
    const userDocRef = doc(db, 'users', user.id);
    const currentWishlist = user.wishlist || [];
    const newWishlist = currentWishlist.includes(propertyId)
        ? currentWishlist.filter(id => id !== propertyId)
        : [...currentWishlist, propertyId];
    
    await updateDoc(userDocRef, { wishlist: newWishlist });
  }, [user]);

  const switchToHostRole = useCallback(async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { role: 'host' as UserRole });
  }, []);

  const toggleUserStatus = useCallback(async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'super-admin') {
            console.error("Cannot disable super-admin.");
            return;
        }
        await updateDoc(userDocRef, { isDisabled: !userData.isDisabled });
        if (user?.id === userId && !userData.isDisabled) {
            logout();
        }
    }
  }, [user, logout]);

  const updateUser = useCallback(async (userId: string, data: Partial<User>) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, data);
  }, []);

  const value = { user, loading, users, login, signup, logout, deleteUser, submitForVerification, updateVerificationStatus, toggleWishlist, isInWishlist, switchToHostRole, toggleUserStatus, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
