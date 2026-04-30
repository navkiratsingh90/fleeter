import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import Email from 'next-auth/providers/email'
import connectDb from './lib/db'
import User from './models/user-model'
import bcrypt from 'bcryptjs'

export const {handlers, signIn , signOut , auth} = NextAuth({
	providers : [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				Email: { label: "Email", type: "text", placeholder: "jsmith" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials,req) {
				if (!credentials?.Email || !credentials.password){
					throw Error("invalid credentials")
				}
				await connectDb()
				const user = await User.findOne({ email: credentials.Email });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }
				return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          role: user.role,
        };
			}
		})
	],
	callbacks : {
		async jwt({token, user}){
			if (user){
				token.id = user.id
				token.name = user.name
				token.role = user.role
				token.email = user.email
			}
			return token
		},
		async session({session,token}){
			if (session.user){
				session.user.id = token.id as string
				session.user.name = token.name as string
				session.user.role = token.role as string
				session.user.email = token.email as string
			}
			return session
		}
	},
	secret : process.env.AUTH_SECRET,
	pages : {
		signIn : '/signin'
	},
	session: {
		strategy : "jwt",
		maxAge : 10*24*60*60
	},
})