import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/dashboard/login')
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <Sidebar rol={session.user.rol} nombre={session.user.nombre} />
      <main className="flex-1 min-w-0 px-6 sm:px-10 py-8 cursor-hoja">{children}</main>
    </div>
  )
}
