import React, { createContext, useReducer, useEffect } from "react";

// Initial state
const INITIAL_STATE = {
  user: null,  // Start with no user
  isFetching: false,
  error: false,
};

// Reducer function to update state based on action
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isFetching: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isFetching: false,
        user: action.payload,
        error: false,
      };
    case "LOGIN_FAILURE":
      return { ...state, isFetching: false, error: true };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        // Parse user only if it's a valid string
        const parsedUser = JSON.parse(user);
        dispatch({ type: "LOGIN_SUCCESS", payload: parsedUser });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        // If there's an error parsing, consider resetting to null
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever the user changes
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ user: state.user, isFetching: state.isFetching, error: state.error, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
