import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import { getUserByEmail, verifyPassword, updateLastLogin } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;

        // Admin check first (env-based)
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;
        if (username === adminUser && password === adminPass) {
          return { id: "admin", name: adminUser, role: "instructor", login: adminUser };
        }

        // Student check: email + password hash
        const user = getUserByEmail(username);
        if (!user) return null;
        if (!verifyPassword(password, user.password_hash)) return null;

        updateLastLogin(user.id);
        return {
          id: String(user.id),
          name: user.name,
          role: user.role,
          login: user.email,
        };
      },
    }),
  ],
});
