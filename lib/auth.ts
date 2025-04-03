export interface User {
  id: string;
  email: string;
  username: string;
  image?: string;
}

export interface SessionData {
  user: User;
  expires: string;
}

export const getSession = async (): Promise<SessionData | null> => {
  return null;
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  console.log("Sign in attempted with:", { email, password });

  return {
    success: false,
    message: "Authentication not implemented yet",
  };
};

export const signUp = async (
  email: string,
  username: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  console.log("Sign up attempted with:", { email, username, password });

  return {
    success: false,
    message: "Registration not implemented yet",
  };
};

export const signOut = async (): Promise<void> => {
  console.log("Sign out attempted");
};
