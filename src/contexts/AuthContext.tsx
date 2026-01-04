import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// User type matching backend response
interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  subdomain?: string;
  roles?: Array<{ id: string; name: string; display_name: string }>;
  profile: {
    full_name: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
    links: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  settings: {
    theme: string;
    notifications_enabled: boolean;
    email_notifications: boolean;
  };
  created_at: string;
  updated_at: string;
}

interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage and validate with backend
  useEffect(() => {
    const loadSession = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const expiresAt = localStorage.getItem('expires_at');

        if (!accessToken || !refreshToken) {
          setLoading(false);
          return;
        }

        // Check if token is expired
        if (expiresAt && Date.now() / 1000 > parseInt(expiresAt)) {
          // Token expired, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('expires_at');
          setLoading(false);
          return;
        }

        // Validate session with backend
        const response = await fetch('/api/v1/auth/session', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.data?.user || data.user;

          if (userData) {
            setUser(userData);
            setSession({
              user: userData,
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_at: parseInt(expiresAt || '0'),
            });
          }
        } else {
          // Session invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('expires_at');
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        // Clear invalid session
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_at');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signInWithGitHub = async () => {
    // Redirect to backend GitHub OAuth endpoint
    window.location.href = '/api/v1/auth/github';
  };

  const signInWithGoogle = async () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = '/api/v1/auth/google';
  };

  const refreshUser = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      const response = await fetch('/api/v1/auth/session', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data?.user || data.user;

        if (userData) {
          setUser(userData);
          if (session) {
            setSession({
              ...session,
              user: userData,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const signOut = async () => {
    try {
      // Call backend logout endpoint
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and storage
      setUser(null);
      setSession(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires_at');

      // Redirect to home page
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGitHub,
        signInWithGoogle,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
