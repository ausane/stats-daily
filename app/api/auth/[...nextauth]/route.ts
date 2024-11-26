import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/user.model";
import connectToDatabase from "@/lib/db/mongodb";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          email: user.email,
          name: user.name,
          image: user.image,
        });
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
