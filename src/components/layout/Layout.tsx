import { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { useAuth } from '@/contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <AppHeader 
        userName={user?.user_metadata?.name || user?.email?.split('@')[0]}
        userEmail={user?.email}
        userAvatar={user?.user_metadata?.avatar_url}
      />
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}