import Header from '@/components/Header'
import { auth } from '@/lib/better-auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

async function Layout({children}:{children:React.ReactNode}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Validate session exists and has user
  if(!session || !session.user) {
    redirect('/sign-in')
  }

  // TypeScript now knows session.user exists after the redirect check
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email
  }

  return (
    <main className='min-h-screen text-gray-400'>
        <Header user={user}/>
        <div className='container py-10'>
            {children}
        </div>
    </main>
  )
}

export default Layout
