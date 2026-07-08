import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { Rol } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      nombre: string
      correo: string
      rol: Rol
    }
  }
  interface User {
    id: string
    nombre: string
    correo: string
    rol: Rol
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    nombre: string
    correo: string
    rol: Rol
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/dashboard/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        correo: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.password) return null

        const usuario = await prisma.usuario.findUnique({
          where: { correo: credentials.correo.toLowerCase().trim() },
        })

        if (!usuario || !usuario.activo) return null

        const valid = await bcrypt.compare(credentials.password, usuario.passwordHash)
        if (!valid) return null

        return {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.nombre = user.nombre
        token.correo = user.correo
        token.rol = user.rol
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.nombre = token.nombre
      session.user.correo = token.correo
      session.user.rol = token.rol
      return session
    },
  },
}
