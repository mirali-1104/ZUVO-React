import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New error state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/profile`, // Using environment variable for API URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setUser(null);
      setError("Session expired or invalid token.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`, // Using environment variable for API URL
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      setError(null); // Clear any previous errors
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null); // Clear any errors on logout
  };

  const updateName = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update-name`, // Using environment variable for API URL
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update name");
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update name",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error, // Providing error to the context
        login,
        logout,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
