import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { httpClient } from '../../kernel/http/axios-client';

interface AuthGuardProps {
  children: React.ReactNode;
  isPrivate: boolean;
}

export const AuthGuard = ({ children, isPrivate }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('ACCESS_TOKEN');

      if (isPrivate) {
        if (!token) {
          navigate('/login');
          return;
        }

        try {
          const response = await httpClient.doGet<boolean>('/auth/verify-access-token');
          
          if (response.success) {
             setIsLoading(false);
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          localStorage.removeItem('ACCESS_TOKEN');
          navigate('/login');
        }
      } else {
        // Public route (Login)
        if (token) {
          try {
            const response = await httpClient.doGet<boolean>('/auth/verify-access-token');
             
             if (response.success) {
               navigate('/orders'); // Redirect to orders if already logged in
               return;
             } else {
               // Token invalid, clear it and stay on login
               localStorage.removeItem('ACCESS_TOKEN');
               setIsLoading(false);
             }
          } catch (error) {
             localStorage.removeItem('ACCESS_TOKEN');
             setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [navigate, isPrivate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
