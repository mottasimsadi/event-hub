'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, returnUrl?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async (email: string, password: string, returnUrl?: string) => Promise.resolve(),
  logout: () => {},
  checkAuth: async () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Verify token with the server
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
          credentials: 'include', // Include cookies in the request
        });
        
        const data = await response.json();
        
        if (data.authenticated) {
          // Fetch the latest user data from the database to get updated role
          try {
            const userResponse = await fetch(`/api/users/${data.user.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              console.log('Latest user data from DB:', userData.user);
              // Update user with the latest data from database
              setUser(userData.user);
            } else {
              console.log('Failed to fetch latest user data, using token data:', data.user);
              // Fall back to token data if user fetch fails
              setUser(data.user);
            }
          } catch (userError) {
            console.error('Error fetching latest user data:', userError);
            // Fall back to token data if user fetch fails
            setUser(data.user);
          }
        } else {
          // Clear invalid token
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const handleAuthStateChange = () => {
      checkUserAuth();
    };

    // Add event listener for auth state changes
    window.addEventListener('auth-state-changed', handleAuthStateChange);

    checkUserAuth();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChange);
    };
  }, []);

  const login = async (email: string, password: string, returnUrl?: string) => {
    try {
      setLoading(true);
      // Clear any existing token and user data first to ensure we don't have stale data
      localStorage.removeItem('token');
      setUser(null); // Clear user state before setting new data
      
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Set user data immediately to prevent loading state issues
      setUser(data.user);
      
      // Fetch the latest user data from the database to get updated role
      try {
        const userResponse = await fetch(`/api/users/${data.user.id}`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('Login: Latest user data from DB:', userData.user);
          // Update user with the latest data from database
          setUser(userData.user || data.user);
        } else {
          console.log('Login: Failed to fetch latest user data, using token data:', data.user);
          // We already set the user above, so no need to set it again
        }
      } catch (userError) {
        console.error('Login: Error fetching latest user data:', userError);
        // We already set the user above, so no need to set it again
      }
      
      toast.success(`Welcome, ${data.user.name || 'User'}!`);
      
      // Dispatch auth state change event
      window.dispatchEvent(new Event('auth-state-changed'));
      
      // Navigate to return URL or dashboard
      if (returnUrl && !returnUrl.includes('/login') && !returnUrl.includes('/signup')) {
        router.replace(returnUrl);
      } else {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      setLoading(false); // Make sure to set loading to false on error
    }
  };

  const logout = async () => {
    const path = window.location.pathname;
    const isDashboardRoute = path.includes('/dashboard');
    
    const logoutMessage = isDashboardRoute
      ? 'Are you sure? You will need to log in again to access the dashboard.'
      : 'Are you sure you want to logout? You will need to log in again to access your account.';
    
    toast.info(
      <div className="flex flex-col space-y-2">
        <p className="font-medium">{logoutMessage}</p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              try {
                // Call the logout API endpoint
                const response = await fetch('/api/auth/logout', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                
                // Clear local storage and state regardless of API response
                localStorage.removeItem('token');
                setUser(null);
                
                // Force a re-render of components that depend on auth state
                window.dispatchEvent(new Event('auth-state-changed'));
                
                // No need to call router.refresh() as it can cause issues with navigation
                
                toast.success('Logged out! You have successfully logged out.');
                
                if (isDashboardRoute || window.location.pathname.includes('/analytics') || window.location.pathname.includes('/admin/analytics')) {
                  // Redirect to login page without callback URL
                  router.replace('/login');
                }
              } catch (error) {
                console.error('Logout error:', error);
                // Still clear local state even if API fails
                localStorage.removeItem('token');
                setUser(null);
                
                // Force a re-render of components that depend on auth state
                window.dispatchEvent(new Event('auth-state-changed'));
                
                // No need to call router.refresh() as it can cause issues with navigation
                
                toast.success('Logged out! You have successfully logged out.');
                
                if (isDashboardRoute) {
                  router.replace('/login');
                }
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: 5000,
        icon: null, // Remove the icon from the toast
      }
    );
  };

  const checkAuth = async (): Promise<boolean> => {
    if (user) return true;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();
      if (data.authenticated && data.user) {
        // Update user state if authenticated
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}