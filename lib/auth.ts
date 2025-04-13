export interface User {
  id: string;
  email: string;
  username: string;
  image?: string;
}

export interface SessionData {
  user: User;
  expires: string;
  token?: string;
}

export const getSession = async (): Promise<SessionData | null> => {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.token) {
      // Store auth token in local storage or cookies
      localStorage.setItem("authToken", data.token);
    }

    return data;
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      message: "Authentication failed. Please try again later.",
    };
  }
};

export const signUp = async (
  email: string,
  username: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();

    if (data.success && data.token) {
      // Store auth token in local storage or cookies
      localStorage.setItem("authToken", data.token);
    }

    return data;
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      message: "Registration failed. Please try again later.",
    };
  }
};

//  Sign out the current user

export const signOut = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    // Remove token from storage
    localStorage.removeItem("authToken");

    // Call logout endpoint to check if the user is logged out on server
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      message: "Sign out failed. Please try again.",
    };
  }
};

export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      message: "Password reset request failed. Please try again later.",
    };
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    return await response.json();
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message: "Password reset failed. Please try again later.",
    };
  }
};
