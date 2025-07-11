
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, UserRole, UserVerificationStatus } from '@/types';
import { db, auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  AuthError,
  AuthErrorCodes
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc,
  query,
} from 'firebase/firestore';


type SignupData = Omit<User, 'id' | 'verificationStatus' | 'avatar' | 'password' | 'wishlist'> & {
    password?: string;
};

interface AuthContextType {
  user: User | null | undefined; // undefined means loading, null means not logged in
  loading: boolean;
  users: User[];
  loginWithEmail: (email: string, password?: string) => Promise<FirebaseUser>;
  signup: (userData: SignupData) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
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
  loginWithEmail: async () => { throw new Error('loginWithEmail not implemented'); },
  signup: async () => { throw new Error('signup not implemented'); },
  logout: async () => {},
  deleteUser: async () => {},
  submitForVerification: async () => {},
  updateVerificationStatus: async () => {},
  toggleWishlist: async () => {},
  isInWishlist: () => false,
  switchToHostRole: async () => {},
  toggleUserStatus: async () => {},
  updateUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !auth) {
      console.log("Firebase config keys are not all defined or are placeholders. Authentication will be disabled.");
      setLoading(false);
      setUser(null);
      return;
    }
    
    const unsubscribeUsers = onSnapshot(query(collection(db, 'users')), (snapshot) => {
        const updatedUsers: User[] = [];
        snapshot.forEach(doc => {
            updatedUsers.push({ id: doc.id, ...doc.data() } as User);
        });
        setUsers(updatedUsers);
    }, (error) => {
        console.error("Error fetching users snapshot: ", error);
    });
    
    // Firebase Auth state listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;

          if (userData.isDisabled) {
            await signOut(auth);
            setUser(null);
          } else {
            // Check if the user is the designated super admin
            const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
            if (userData.email === superAdminEmail && userData.role !== 'super-admin') {
              // Elevate to super admin
              userData.role = 'super-admin';
              await updateDoc(userDocRef, { role: 'super-admin' });
            }
            setUser(userData);
          }
        } else {
            // This case can happen if a user is deleted from Firestore but not Auth
            await signOut(auth);
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
        unsubscribeUsers();
        unsubscribeAuth();
    };
  }, []);
  
  const loginWithEmail = useCallback(async (email: string, password?: string): Promise<FirebaseUser> => {
    if (!auth || !password) {
      throw new Error("Firebase configuration is missing. Please add your Firebase project keys to the .env file.");
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch(error) {
        const authError = error as AuthError;
        if (authError.code === AuthErrorCodes.INVALID_CREDENTIAL) {
            throw new Error("Invalid email or password. Please try again.");
        }
        console.error("Firebase login error:", error);
        throw new Error("An unknown error occurred during login.");
    }
  }, []);

  const signup = useCallback(async (userData: SignupData): Promise<FirebaseUser> => {
     if (!auth || !db || !userData.password) {
      throw new Error("Firebase configuration is missing. Please add your Firebase project keys to the .env file.");
    }
    
    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
    if (userData.email === superAdminEmail) {
      throw new Error("This email is reserved. Please use a different email to sign up.");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const firebaseUser = userCredential.user;

        const newUser: Omit<User, 'id'> = {
            name: userData.name,
            email: firebaseUser.email || userData.email,
            phone: userData.phone,
            dob: userData.dob,
            avatar: `https://placehold.co/100x100.png?text=${userData.name.charAt(0)}`,
            role: 'user',
            verificationStatus: 'unverified',
            wishlist: [],
            isDisabled: false,
        };
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, newUser);

        return firebaseUser;
    } catch(error) {
        const authError = error as AuthError;
        if (authError.code === AuthErrorCodes.EMAIL_EXISTS) {
            throw new Error("An account with this email already exists.");
        } else if (authError.code === AuthErrorCodes.WEAK_PASSWORD) {
            throw new Error("The password is too weak. Please use at least 6 characters.");
        }
        console.error("Firebase signup error:", authError);
        throw new Error("An unknown error occurred during signup.");
    }
  }, []);

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
  }, []);
  
  const deleteUser = useCallback(async (userId: string) => {
    if (!db) return;
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === 'super-admin') {
      console.error("Cannot delete super-admin.");
      return;
    }
    await deleteDoc(userDocRef);
  }, []);

  const submitForVerification = useCallback(async (userId: string, documentUrl: string) => {
    if (!db) return;
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { 
      verificationStatus: 'pending', 
      identityDocumentUrl: documentUrl 
    });
  }, []);

  const updateVerificationStatus = useCallback(async (userId: string, status: UserVerificationStatus) => {
    if (!db) return;
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
    if (!user || !db) return;
    
    const userDocRef = doc(db, 'users', user.id);
    const currentWishlist = user.wishlist || [];
    const newWishlist = currentWishlist.includes(propertyId)
        ? currentWishlist.filter(id => id !== propertyId)
        : [...currentWishlist, propertyId];
    
    await updateDoc(userDocRef, { wishlist: newWishlist });
    setUser(prev => prev ? {...prev, wishlist: newWishlist} : null);
  }, [user]);

  const switchToHostRole = useCallback(async (userId: string) => {
    if (!db) return;
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { role: 'host' as UserRole });
  }, []);

  const toggleUserStatus = useCallback(async (userId: string) => {
    if (!db || !auth) return;
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'super-admin') {
            console.error("Cannot disable super-admin.");
            return;
        }
        await updateDoc(userDocRef, { isDisabled: !userData.isDisabled });
        // If the admin disables the currently logged-in user, log them out.
        if (auth.currentUser?.uid === userId && !userData.isDisabled) {
            logout();
        }
    }
  }, [logout]);

  const updateUser = useCallback(async (userId: string, data: Partial<User>) => {
    if (!db) return;
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, data);
  }, []);

  const value = { user, loading, users, loginWithEmail, signup, logout, deleteUser, submitForVerification, updateVerificationStatus, toggleWishlist, isInWishlist, switchToHostRole, toggleUserStatus, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
