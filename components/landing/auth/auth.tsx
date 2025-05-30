'use client'

import { UserCircle } from 'lucide-react'

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs'

import { AuthSkeleton } from '@/components/landing/skeleton'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

const Auth = () => {
  return (
    <Popover>
      <ClerkLoading>
        <AuthSkeleton />
      </ClerkLoading>

      <ClerkLoaded>
        <SignedOut>
          <PopoverTrigger className='flex items-center justify-center'>
            <UserCircle className='size-7 cursor-pointer text-muted-foreground' />
          </PopoverTrigger>

          <PopoverContent className='flex flex-col gap-2'>
            <SignUpButton mode='modal'>
              <Button size='default' variant='ghost'>
                Crear Cuenta
              </Button>
            </SignUpButton>

            <SignInButton mode='modal'>
              <Button size='default' variant='default'>
                Iniciar Sesión
              </Button>
            </SignInButton>
          </PopoverContent>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </ClerkLoaded>
    </Popover>
  )
}

export default Auth
