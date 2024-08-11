// Import required modules and types from React and react-router-dom libraries
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Import authentication context for retrieving user and token information
import { useAuth } from "../context/AuthContext";

// Define a PrivateRoute component that wraps child componets to ensure user authentication
const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Destructure user and token from the authentication context
  const { token, user } = useAuth();

  // if there's no token or uer id, redirect to the login page
  if (!token || !user?._id) return <Navigate to="/login" replace />;

  // if there's a token and user id, render the child components
  return children;
};

export default PrivateRoute;
