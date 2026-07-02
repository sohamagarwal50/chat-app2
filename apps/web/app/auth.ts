import NextAuth from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
export const {handlers,auth} = NextAuth({
    providers :[
        CredentialsProvider({
            name : "Email",
            credentials :{
                username : {label : "username",type :"text",placeholder : "email@example.com"},
                password : {label : "password",type : "password"}
            },
            async authorize(credentials){
                const username = credentials?.username as string;
                const password = credentials?.password as string;
                try{
                    const user = await prismaClient.user.findFirst({
                        where :{
                            email : username,
                            password : password
                        }
                    });
                    if(user?.email === username && user.password === password){
                        console.log("signed in");
                        return {
                            id : user.id,
                            email : user.email
                        }
                    }
                    return null;
                }
                catch(err){
                    return null;
                }
            }

        })],
        callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback");
            console.log("user:", user);
            console.log("token:", token);
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.backendToken = jwt.sign({userId: user.id,email: user.email},process.env.NEXTAUTH_SECRET!);
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.backendToken = token.backendToken as string;

            }

            return session;
        },
    },
    secret : process.env.NEXTAUTH_SECRET
})