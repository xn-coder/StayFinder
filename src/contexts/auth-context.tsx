
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, UserRole, UserVerificationStatus } from '@/types';
import { dummyUsers as initialUsers } from '@/lib/dummy-data';
import { db, auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  deleteDoc,
  getDoc,
  setDoc,
  writeBatch,
  query,
  updateDoc,
  getDocs,
  where
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

  // Initialize and subscribe to users collection
  useEffect(() => {
    if (!db) {
      console.error("Firestore is not initialized. Check Firebase config.");
      setLoading(false);
      return;
    }
    const usersCollection = collection(db, 'users');

    const setupFirestore = async () => {
      const snapshot = await getDocs(usersCollection);
      if (snapshot.empty) {
        console.log('No users found, seeding database...');
        const batch = writeBatch(db);
        initialUsers.forEach(u => {
          const docRef = doc(db, 'users', u.id);
           if (u.id.startsWith('user-')) {
             batch.set(docRef, u);
           }
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
      }, (error) => {
          console.error("Error fetching users snapshot: ", error);
      });

      return () => unsubscribe();
    });
  }, []);

  // Firebase Auth state listener
  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      setUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          if (userData.isDisabled) {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(userData);
          }
        } else {
            await signOut(auth);
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = useCallback(async (email: string, password?: string): Promise<FirebaseUser> => {
    if (!auth || !password) {
      throw new Error("Auth service not available or password missing. Please ensure Firebase is configured correctly in your .env file.");
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch(error) {
        console.error("Firebase login error:", error);
        throw new Error("Invalid credentials. Please check your email and password.");
    }
  }, []);

  const signup = useCallback(async (userData: SignupData): Promise<FirebaseUser> => {
     if (!auth || !db || !userData.password) {
      throw new Error("Auth service not available or password missing. Please ensure Firebase is configured correctly in your .env file.");
    }
    const q = query(collection(db, 'users'), where('email', '==', userData.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("An account with this email already exists.");
    }

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
