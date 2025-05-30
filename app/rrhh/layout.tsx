import Link from 'next/link'

import Header from '@/components/header'

export default function RRHHLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header>
        <Link
          href='/rrhh/areas'
          className='text-sm font-medium text-neutral-500'
        >
          Areas
        </Link>
      </Header>

      <main className='mx-auto max-w-6xl space-y-4 px-4 py-6'>{children}</main>
    </>
  )
}
