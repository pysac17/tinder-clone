// In src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { app } from '../firebase'; // Import the initialized app

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function logout() {
    return signOut(auth);
  }

  function updateProfile(profile) {
    return updateFirebaseProfile(auth.currentUser, profile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        console.log('User signed in:', user.uid);
        
        // Save/update user data in Firestore
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('http://localhost:5000/api/update-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            })
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.error('Failed to update user in Firestore:', error);
          } else {
            console.log('User data updated in Firestore');
          }
        } catch (error) {
          console.error('Error updating user in Firestore:', error);
        }
      } else {
        console.log('User signed out');
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    loginWithGoogle,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}