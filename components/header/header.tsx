import { Suspense } from 'react'

import Auth from '@/components/landing/auth'
import Logo from '@/components/logo'

interface HeaderProps {
  children?: React.ReactNode
}

const Header = ({ children }: HeaderProps) => {
  return (
    <header className='sticky top-0 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-lg bg-white/85 p-4 backdrop-blur-md lg:top-1'>
      {/* logo */}
      <Logo />

      {/* navigation */}
      {children}

      {/* auth */}
      <Suspense
        fallback={
          <div className='h-7 w-7 animate-pulse rounded-md bg-gray-200' />
        }
      >
        <Auth />
      </Suspense>
    </header>
  )
}

export default Header
