import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

interface AuthContextType {
  user: firebase.User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleAnonymousSignIn = async () => {
      try {
        const { user: anonymousUser } = await auth.signInAnonymously();
        setUser(anonymousUser);
      } catch (error) {
        console.error("Error signing in anonymously:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          setIsAdmin(!!idTokenResult.claims.isAdmin);
        } catch (error) {
          console.error("Error getting user claims:", error);
          setIsAdmin(false);
        }
        setUser(firebaseUser);
        setLoading(false);
      } else {
        setIsAdmin(false);
        handleAnonymousSignIn();
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = (email: string, password: string) => {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.isAnonymous) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password);
      return currentUser.linkWithCredential(credential);
    }
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  const value = {
    user,
    loading,
    isAdmin,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};