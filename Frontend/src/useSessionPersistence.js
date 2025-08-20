// useSessionPersistence.js
import { useEffect } from 'react';
import { useAuth } from './AuthContext'; // Adjust the path based on your project structure

const useSessionPersistence = () => {
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const savedLoginStatus = sessionStorage.getItem('isLoggedIn');
    
    if (savedLoginStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);
};

export default useSessionPersistence;
