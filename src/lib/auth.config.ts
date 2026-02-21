import type { NextAuthConfig } from "next-auth";

// This config is shared with Edge middleware — must NOT import Node.js modules (db, crypto, etc.)
export default {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; role?: string; login?: string };
        token.id = u.id;
        token.role = u.role ?? "student";
        token.login = u.login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as string) ?? "student";
        session.user.login = (token.login as string) ?? "";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = nextUrl.pathname.startsWith("/admin");
      if (isAdmin) {
        if (!auth) return false;
        if (auth.user?.role !== "instructor") return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
