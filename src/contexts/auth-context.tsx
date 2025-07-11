
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
  User as FirebaseUser
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
  getDocs
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
    const usersCollection = collection(db, 'users');

    const setupFirestore = async () => {
      const snapshot = await getDocs(usersCollection);
      if (snapshot.empty) {
        console.log('No users found, seeding database...');
        // We cannot seed users with Firebase Auth enabled without their interaction
        // So we will just add their data to firestore.
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
      }, (error) => {
          console.error("Error fetching users snapshot: ", error);
      });

      return () => unsubscribe();
    });
  }, []);

  // Firebase Auth state listener
  useEffect(() => {
    if (!auth) {
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
            // This case might happen if a user exists in Auth but not Firestore.
            // For this app's logic, we log them out.
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
      throw new Error("Auth service not available or password missing.");
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }, []);

  const signup = useCallback(async (userData: SignupData): Promise<FirebaseUser> => {
     if (!auth || !userData.password) {
      throw new Error("Auth service not available or password missing.");
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
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === 'super-admin') {
      console.error("Cannot delete super-admin.");
      return;
    }
    // Note: This only deletes the Firestore record, not the Firebase Auth user.
    // Proper user deletion would require a Cloud Function to delete the Auth user.
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
    // Optimistically update local state
    setUser(prev => prev ? {...prev, wishlist: newWishlist} : null);
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
        if (auth?.currentUser?.uid === userId && !userData.isDisabled) {
            logout();
        }
    }
  }, [logout]);

  const updateUser = useCallback(async (userId: string, data: Partial<User>) => {
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
